/* eslint-disable @typescript-eslint/ban-types */
// Using `Record<stirng, unknown>` instead of `{}` is way to verbose here.

import { printSchema } from 'gatsby/graphql';
import type { GraphQLSchema } from 'gatsby/graphql';
import type { IDefinitionMeta } from 'gatsby/dist/redux/types';
import type {
  ActionFunction,
  ActionObject,
  ConditionPredicate,
  ServiceConfig,
  Interpreter,
  StateNode,
} from 'xstate';
import { Machine, actions } from 'xstate';
import type { Option } from '@cometjs/core';

import type { TypegenReporter } from '../internal/reporter';
import { makeDefaultReporter } from '../internal/reporter';
import type { FragmentDefinition } from '../internal/utils';
import {
  guessIfUnnnamedQuery,
  guessIfThirdPartyDefinition,
  isFragmentDefinition,
} from '../internal/utils';

const { assign, send, cancel } = actions;

export type DefinitionChangeset = {
  type: 'added' | 'changed' | 'deleted',
  definition: IDefinitionMeta,
};

export type TypegenContext = {
  reporter: TypegenReporter,

  /**
   * Tracked GatsbyJS schema
   */
  schema: Option.T<GraphQLSchema>,

  /**
   * Tracked IDefinitionMeta object extracted by Gatsby.
   *
   * Which definitions should be tracked?
   * - Written by the user
   * - Has unique name (guaranteed by the query compiler)
   */
  trackedDefinitions: Option.T<Map<IDefinitionMeta['name'], IDefinitionMeta>>,

  /**
   * GraphQL fragments by 3rd-party plugins
   * the key is the name of the fragment and the value is a IDefinitionMeta object extracted by Gatsby's query compiler
   *
   * This is static after set once, entries would never be changed.
   */
  thirdpartyFragmentDefinitions: FragmentDefinition[],

  /**
   * Tracked status of the GraphQL schema change
   */
  hasSchemaChanged: boolean,

  /**
   * Recent changeset of GraphQL definitions
   */
  definitionChangesets: DefinitionChangeset[],
};

type TypegenStateSchema = {
  states: {
    idle: {},
    emittingOnce: {
      states: {
        codegen: {
          states: {
            pending: {},
            done: {},
          },
        },
        emitSchema: {
          states: {
            pending: {},
            done: {},
          },
        },
        emitPluginDocuments: {
          states: {
            pending: {},
            done: {},
          },
        },
        autoFixCodes: {
          states: {
            pending: {},
            done: {},
          },
        },
      },
    },
    develop: {
      states: {
        idle: {},
        emitting: {
          states: {
            codegen: {
              states: {
                starting: {},
                pending: {},
                done: {},
              },
            },
            emitSchema: {
              states: {
                starting: {},
                pending: {},
                done: {},
              },
            },
            autoFixCodes: {
              states: {
                starting: {},
                pending: {},
                done: {},
              },
            },
          },
        },
      },
    },
  },
};

export type TypegenEvent = (
  | { type: 'CREATE_DEV_SERVER' }
  | { type: 'SCHEDULE_NEXT_WORK' }
  | { type: 'SET_SCHEMA', schema: GraphQLSchema }
  | { type: 'SET_GRAPHQL_DEFINITIONS', definitions: IDefinitionMeta[] }
  | { type: 'START_JOB' }
);

export type TypegenActionName = (
  | 'assignSchema'
  | 'assignTrackedDefinitions'
  | 'assignThirdPartyFragmentDefinitions'
  | 'assignDefinitionChangesets'
  | 'clearSchemaChange'
  | 'clearDefinitionChangesets'
);

export type TypegenActionConfig = Record<
  TypegenActionName,
  (
    | ActionObject<TypegenContext, TypegenEvent>
    | ActionFunction<TypegenContext, TypegenEvent>
  )
>;

const typegenActions: TypegenActionConfig = {
  assignSchema: assign((ctx, event) => {
    const { reporter } = ctx;

    if (event.type !== 'SET_SCHEMA') {
      reporter.error(reporter.stripIndent`
        The action 'assignSchema' is only allowed in 'SET_SCHEMA' event

          Expected SET_SCHEMA, but got ${event.type}

        This seems a bug of gatsby-plugin-typegen
        Please report to https://github.com/cometkim/gatsby-plugin-typegen/issues
      `);
      return ctx;
    }

    return {
      ...ctx,
      schema: event.schema,
      hasSchemaChanged: ctx.schema && printSchema(ctx.schema) !== printSchema(event.schema),
    };
  }),
  assignTrackedDefinitions: assign((ctx, event) => {
    const { reporter } = ctx;

    if (event.type !== 'SET_GRAPHQL_DEFINITIONS') {
      reporter.error(reporter.stripIndent`
        The action 'assignTrackedDefinitions' is only allowed in 'SET_GRAPHQL_DEFINITIONS' event

          Expected SET_GRAPHQL_DEFINITIONS, but got ${event.type}

        This seems a bug of gatsby-plugin-typegen
        Please report to https://github.com/cometkim/gatsby-plugin-typegen/issues
      `);
      return ctx;
    }

    const trackedDefinitions = new Map(
      event.definitions
      .filter(def => !guessIfThirdPartyDefinition(def))
      .filter(def => !guessIfUnnnamedQuery(def))
      .map(def => [def.name, def] as const),
    );

    return {
      ...ctx,
      trackedDefinitions,
    };
  }),
  assignThirdPartyFragmentDefinitions: assign((ctx, event) => {
    const { reporter } = ctx;

    if (event.type !== 'SET_GRAPHQL_DEFINITIONS') {
      reporter.error(reporter.stripIndent`
        The action 'assignThirdPartyFragmentDefinitions' is only allowed in 'SET_GRAPHQL_DEFINITIONS' event

          Expected SET_GRAPHQL_DEFINITIONS, but got ${event.type}

        This seems a bug of gatsby-plugin-typegen
        Please report to https://github.com/cometkim/gatsby-plugin-typegen/issues
      `);
      return ctx;
    }

    const thirdpartyFragmentDefinitions = (
      event.definitions
      .filter(guessIfThirdPartyDefinition)
      .filter(isFragmentDefinition)
    ) as FragmentDefinition[];
    return {
      ...ctx,
      thirdpartyFragmentDefinitions,
    };
  }),
  assignDefinitionChangesets: assign((ctx, event) => {
    const { reporter, trackedDefinitions } = ctx;

    if (event.type !== 'SET_GRAPHQL_DEFINITIONS') {
      reporter.error(reporter.stripIndent`
        The action 'scheduleEmitSchemaJob' is only allowed in 'SET_GRAPHQL_DEFINITIONS' event

          Expected SET_GRAPHQL_DEFINITIONS, but got ${event.type}

        This seems a bug of gatsby-plugin-typegen
        Please report to https://github.com/cometkim/gatsby-plugin-typegen/issues
      `);
      return ctx;
    }

    if (trackedDefinitions == null) {
      reporter.error(reporter.stripIndent`
        The context 'trackedDefinitions' doesn't have initialized properly

        This seems a bug of gatsby-plugin-typegen
        Please report to https://github.com/cometkim/gatsby-plugin-typegen/issues
      `);
      return ctx;
    }

    const newDefinitions = event.definitions
      .filter(def => !guessIfThirdPartyDefinition(def))
      .filter(def => !guessIfUnnnamedQuery(def));

    const changesets = newDefinitions
      .map(definition => {
        const tracked = trackedDefinitions.get(definition.name);
        if (!tracked) {
          return { type: 'added' as const, definition };
        }
        if (definition.hash !== tracked.hash) {
          return { type: 'changed' as const, definition };
        }
        return null;
      })
      .filter(Boolean) as DefinitionChangeset[];

    const deletedChangesets = [...trackedDefinitions.values()]
        .filter(tracked => !newDefinitions.find(def => def.name === tracked.name));

    console.log(changesets, deletedChangesets);

    return {
      ...ctx,
      definitionChangeset: [
        ...changesets,
        ...deletedChangesets,
      ],
    };
  }),
  clearSchemaChange: assign({
    hasSchemaChanged: _ctx => false,
  }),
  clearDefinitionChangesets: assign({
    definitionChangesets: _ctx => [],
  }),
};

export type TypegenTransitionGuardName = (
  | 'hasSchemaAndDefinitions?'
  | 'hasSchemaChanged?'
  | 'hasDefinitionsChanged?'
  | 'hasSchemaOrDefinitionsChanged?'
);

export type TypegenTransitionGuardConfig = Record<
  TypegenTransitionGuardName,
  ConditionPredicate<TypegenContext, TypegenEvent>
>;

const typegenTransitionGuards: TypegenTransitionGuardConfig = {
  'hasSchemaAndDefinitions?': ctx => Boolean(ctx.schema && ctx.trackedDefinitions),
  'hasSchemaChanged?': ctx => ctx.hasSchemaChanged,
  'hasDefinitionsChanged?': ctx => ctx.definitionChangesets.length > 0,
  'hasSchemaOrDefinitionsChanged?': ctx => ctx.hasSchemaChanged || ctx.definitionChangesets.length > 0,
};

export type TypegenServiceName = (
  | 'codegen'
  | 'emitSchema'
  | 'emitPluginDocuments'
  | 'autoFixCodes'
);

export type TypegenServiceConfig = Record<
  TypegenServiceName,
  ServiceConfig<TypegenContext, TypegenEvent>
>;

const notImplemented = () => { throw new Error('Not implemented, should be configured from outside!'); };

const typegenServices: TypegenServiceConfig = {
  codegen: notImplemented,
  emitSchema: notImplemented,
  emitPluginDocuments: notImplemented,
  autoFixCodes: notImplemented,
};

// ident
const action = (id: TypegenActionName) => id;
const guard = (id: TypegenTransitionGuardName) => id;
const service = (id: TypegenServiceName) => id;

export const typegenMachine = Machine<TypegenContext, TypegenStateSchema, TypegenEvent>({
  initial: 'idle',
  context: {
    reporter: makeDefaultReporter(),
    schema: null,
    trackedDefinitions: null,
    thirdpartyFragmentDefinitions: [],
    hasSchemaChanged: false,
    definitionChangesets: [],
  },
  states: {
    idle: {
      on: {
        SET_SCHEMA: {
          actions: [
            action('assignSchema'),
            send('SCHEDULE_NEXT_WORK'),
          ],
        },
        SET_GRAPHQL_DEFINITIONS: {
          actions: [
            action('assignTrackedDefinitions'),
            action('assignThirdPartyFragmentDefinitions'),
            send('SCHEDULE_NEXT_WORK'),
          ],
        },
        SCHEDULE_NEXT_WORK: {
          target: 'emittingOnce',
          cond: guard('hasSchemaAndDefinitions?'),
        },
        CREATE_DEV_SERVER: {
          target: 'develop',
          cond: guard('hasSchemaAndDefinitions?'),
        },
      },
    },
    emittingOnce: {
      type: 'parallel',
      onDone: 'idle',
      states: {
        emitSchema: {
          initial: 'pending',
          states: {
            pending: {
              invoke: {
                src: service('emitSchema'),
                onDone: 'done',
              },
            },
            done: { type: 'final' },
          },
        },
        emitPluginDocuments: {
          initial: 'pending',
          states: {
            pending: {
              invoke: {
                src: service('emitPluginDocuments'),
                onDone: 'done',
              },
            },
            done: { type: 'final' },
          },
        },
        codegen: {
          initial: 'pending',
          states: {
            pending: {
              invoke: {
                src: service('codegen'),
                onDone: 'done',
              },
            },
            done: { type: 'final' },
          },
        },
        autoFixCodes: {
          initial: 'pending',
          states: {
            pending: {
              invoke: {
                src: service('autoFixCodes'),
                onDone: 'done',
              },
            },
            done: { type: 'final' },
          },
        },
      },
    },
    develop: {
      initial: 'idle',
      entry: [
        action('clearSchemaChange'),
        action('clearDefinitionChangesets'),
      ],
      on: {
        SET_SCHEMA: {
          actions: [
            action('assignSchema'),
            cancel('debounced-work'),
            send('SCHEDULE_NEXT_WORK', {
              id: 'debounced-work',
              delay: 5000,
            }),
          ],
        },
        SET_GRAPHQL_DEFINITIONS: {
          actions: [
            action('assignDefinitionChangesets'),
            cancel('debounced-work'),
            send('SCHEDULE_NEXT_WORK', {
              id: 'debounced-work',
              delay: 5000,
            }),
          ],
        },
      },
      states: {
        idle: {
          on: {
            SCHEDULE_NEXT_WORK: 'emitting',
          },
        },
        emitting: {
          type: 'parallel',
          entry: [
            send('START_JOB'),
          ],
          onDone: [
            {
              target: 'idle',
            },
          ],
          states: {
            emitSchema: {
              initial: 'starting',
              states: {
                starting: {
                  on: {
                    START_JOB: [
                      {
                        cond: guard('hasSchemaChanged?'),
                        target: 'pending',
                      },
                      {
                        target: 'done',
                      },
                    ],
                  },
                },
                pending: {
                  invoke: {
                    src: service('emitSchema'),
                    onDone: 'done',
                  },
                },
                done: {
                  type: 'final',
                },
              },
            },
            codegen: {
              initial: 'starting',
              states: {
                starting: {
                  on: {
                    START_JOB: [
                      {
                        cond: guard('hasSchemaOrDefinitionsChanged?'),
                        target: 'pending',
                      },
                      {
                        target: 'done',
                      },
                    ],
                  },
                },
                pending: {
                  invoke: {
                    src: service('codegen'),
                    onDone: 'done',
                  },
                },
                done: {
                  type: 'final',
                },
              },
            },
            autoFixCodes: {
              initial: 'starting',
              states: {
                starting: {
                  on: {
                    START_JOB: [
                      {
                        cond: guard('hasDefinitionsChanged?'),
                        target: 'pending',
                      },
                      {
                        target: 'done',
                      },
                    ],
                  },
                },
                pending: {
                  invoke: {
                    src: service('autoFixCodes'),
                    onDone: 'done',
                  },
                },
                done: {
                  type: 'final',
                },
              },
            },
          },
        },
      },
    },
  },
}, {
  actions: typegenActions,
  guards: typegenTransitionGuards,
  services: typegenServices,
});

export type TypegenIntepreter = Interpreter<TypegenContext, TypegenStateSchema, TypegenEvent>;

export const makeTypegenMachine = ({
  context,
  services,
}: {
  context: TypegenContext,
  services: TypegenServiceConfig,
}): StateNode<TypegenContext, TypegenStateSchema, TypegenEvent> => {
  return typegenMachine
    .withConfig({ services })
    .withContext(context);
};

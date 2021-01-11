/* eslint-disable @typescript-eslint/ban-types */
// Using `Record<stirng, unknown>` instead of `{}` is way to verbose here.

import type { GraphQLSchema } from 'gatsby/graphql';
import type { IDefinitionMeta } from 'gatsby/dist/redux/types';
import type { ConditionPredicate, ServiceConfig } from 'xstate';
import { Machine, actions } from 'xstate';
import type { Option } from '@cometjs/core';

import type { FragmentDefinition } from '../gatsby-utils';
import { guessIfThirdPartyDefinition, isFragmentDefinition } from '../gatsby-utils';

const { assign, send, cancel } = actions;

type TypegenContext = {
  currentSchema: Option<GraphQLSchema>,

  /**
   * GraphQL fragments by 3rd-party plugins
   * the key is the name of the fragment and the value is a IDefinitionMeta object extracted by Gatsby's query compiler
   *
   * This is static after set once, entries would never be changed.
   */
  pluginDefinitions: Option<Map<FragmentDefinition['name'], FragmentDefinition>>,

  /**
   * Tracked IDefinitionMeta object extracted by Gatsby.
   *
   * What definitions should be tracked?
   * - Written by the user
   * - Has unique name (guaranteed by the query compiler)
   */
  trackedDefinitions: Option<Map<IDefinitionMeta['name'], IDefinitionMeta>>,

  watchingChanges: boolean,

  schemaChanged: boolean,
  operationChanged: boolean,
};

type TypegenStateSchema = {
  states: {
    waitingInitialData: {},
    watching: {},
    running: {
      type: 'parallel',
      states: {
        emitSchema: {
          states: {
            pending: {},
            succeed: {},
            failed: {},
          },
        },
        emitPluginDocuments: {
          states: {
            pending: {},
            succeed: {},
            failed: {},
          },
        },
        autoFixCode: {
          states: {
            pending: {},
            succeed: {},
            failed: {},
          },
        },
      },
    },
    off: {},
  },
};

type TypegenEvent = (
  | { type: 'NEXT' }
  | { type: 'WATCH_CHANGES' }
  | { type: 'SET_SCHEMA', schema: GraphQLSchema }
  | { type: 'SET_GRAPHQL_DEFINITIONS', definitions: IDefinitionMeta[] }
  | { type: 'SCHEDULE_WORK' }
);

type TypegenTransitionGuardName = (
  | 'hasSchemaAndDefinition?'
);

const typegenTransitionGuards: Record<TypegenTransitionGuardName, ConditionPredicate<TypegenContext, TypegenEvent>> = {
  'hasSchemaAndDefinition?': context => Boolean(context.currentSchema && context.trackedDefinitions),
};

type TypegenServiceName = (
  | 'emitSchema'
  | 'emitPluginDocuments'
  | 'autoFixCode'
);

const notImplemented = () => { throw new Error('not implemented') };

const typegenServices: Record<TypegenServiceName, ServiceConfig<TypegenContext, TypegenEvent>> = {
  emitSchema: notImplemented,
  emitPluginDocuments: notImplemented,
  autoFixCode: notImplemented,
};

// ident
const guard = (id: TypegenTransitionGuardName) => id;
const service = (id: TypegenServiceName) => id;

export const typegenMachine = Machine<TypegenContext, TypegenStateSchema, TypegenEvent>({
  initial: 'waitingInitialData',
  context: {
    currentSchema: null,
    pluginDefinitions: null,
    trackedDefinitions: null,
    watchingChanges: false,
    schemaChanged: false,
    operationChanged: false,
  },
  states: {
    waitingInitialData: {
      on: {
        SET_SCHEMA: {
          actions: [
            assign<TypegenContext, Extract<TypegenEvent, { type: 'SET_SCHEMA' }>>({
              currentSchema: (_, event) => event.schema,
            }),
            send('NEXT'),
          ],
        },
        SET_GRAPHQL_DEFINITIONS: {
          actions: [
            assign<TypegenContext, Extract<TypegenEvent, { type: 'SET_GRAPHQL_DEFINITIONS' }>>((context, event) => {
              const pluginDefinitions = new Map(
                event.definitions
                .filter(isFragmentDefinition)
                .filter(guessIfThirdPartyDefinition)
                .map(def => [def.name, def] as const)
              );
              const trackedDefinitions = new Map(
                event.definitions
                .filter(def => !guessIfThirdPartyDefinition(def))
                .map(def => [def.name, def] as const)
              );
              return {
                ...context,
                pluginDefinitions,
                trackedDefinitions,
              };
            }),
            send('NEXT'),
          ],
        },
        NEXT: {
          target: 'emmiting',
          cond: guard('hasSchemaAndDefinition?'),
        },
      },
    },
    watching: {
      on: {
        SET_SCHEMA: {
          actions: [
            cancel('scheduled'),
            send('SCHEDULE_WORK', { id: 'scheduled', delay: 500 }),
            assign<TypegenContext>({ schemaChanged: true }),
          ],
        },
        SET_GRAPHQL_DEFINITIONS: {
          actions: [
            cancel('scheduled'),
            send('SCHEDULE_WORK', { id: 'scheduled', delay: 500 }),
            assign<TypegenContext, Extract<TypegenEvent, { type: 'SET_GRAPHQL_DEFINITIONS' }>>((context, event) => {
              // TODO
              return {
                ...context,
              };
            }),
          ],
        },
        SCHEDULE_WORK: 'running',
      },
    },
    running: {
      type: 'parallel',
      // TODO
      entry: assign({}),
      // TODO
      exit: assign({}),
      states: {
        emitSchema: {
          initial: 'pending',
          states: {
            pending: {
              invoke: {
                src: service('emitSchema'),
                onDone: 'succeed',
                onError: 'failed',
              },
            },
            succeed: {
              type: 'final',
            },
            failed: {
              type: 'final',
            },
          },
        },
        emitPluginDocuments: {
          initial: 'pending',
          states: {
            pending: {
              invoke: {
                src: service('emitPluginDocuments'),
                onDone: 'succeed',
                onError: 'failed',
              },
            },
            succeed: {
              type: 'final',
            },
            failed: {
              type: 'final',
            },
          },
        },
        autoFixCode: {
          initial: 'pending',
          states: {
            pending: {
              invoke: {
                src: service('autoFixCode'),
                onDone: 'succeed',
                onError: 'failed',
              },
            },
            succeed: {
              type: 'final',
            },
            failed: {
              type: 'final',
            },
          },
        },
      },
      onDone: [
        { target: 'watching', cond: context => context.watchingChanges },
        { target: 'off' },
      ],
    },
    off: {
      on: {
        WATCH_CHANGES: {
          target: 'watching',
          actions: assign<TypegenContext>({ watchingChanges: true }),
        },
      },
    },
  },
}, {
  guards: typegenTransitionGuards,
  services: typegenServices,
});

/* eslint-disable @typescript-eslint/ban-types */
// Using `Record<stirng, unknown>` instead of `{}` is way to verbose here.

import type { Reporter } from 'gatsby';
import type { GraphQLSchema } from 'gatsby/graphql';
import type { IDefinitionMeta } from 'gatsby/dist/redux/types';
import type {
  ActionFunction,
  ActionFunctionMap,
  ActionObject,
  ConditionPredicate,
  ServiceConfig,
  Interpreter,
  StateNode,
} from 'xstate';
import { Machine, actions } from 'xstate';
import type { Option } from '@cometjs/core';

import type { FragmentDefinition } from '../internal/utils';
import { guessIfThirdPartyDefinition, isFragmentDefinition } from '../internal/utils';

const { assign, send } = actions;

export type TypegenContext = {
  reporter: Option.T<Reporter>,

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
    emitting: {
      states: {
        codegen: {
          states: {
            idle: {},
            pending: {},
          },
        },
        emitSchema: {
          states: {
            idle: {},
            pending: {},
          },
        },
        autoFixCodes: {
          states: {
            idle: {},
            pending: {},
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
);

export type TypegenActionName = (
  | 'assignSchema'
  | 'assignTrackedDefinitions'
  | 'assignThirdPartyFragmentDefinitions'
);

export type TypegenActionConfig = Record<
  TypegenActionName,
  (
    | ActionObject<TypegenContext, TypegenEvent>
    | ActionFunction<TypegenContext, TypegenEvent>
  )
>;

const typegenActions: TypegenActionConfig = {
  assignSchema: assign({
    schema: (ctx, event) => {
      if (event.type !== 'SET_SCHEMA') {
        ctx.reporter?.warn('[typegen] action `assignSchema` is only allowed in `SET_SCHEMA` event');
        return ctx.schema;
      }
      return event.schema;
    },
  }),
  assignTrackedDefinitions: assign((ctx, event) => {
    if (event.type !== 'SET_GRAPHQL_DEFINITIONS') {
      ctx.reporter?.warn('[typegen] action `assignTrackedDefinitions` is only allowed in `SET_GRAPHQL_DEFINITIONS` event');
      return ctx;
    }
    const trackedDefinitions = new Map(
      event.definitions
      .filter(def => !guessIfThirdPartyDefinition(def))
      .map(def => [def.name, def] as const),
    );
    return {
      ...ctx,
      trackedDefinitions,
    };
  }),
  assignThirdPartyFragmentDefinitions: assign((ctx, event) => {
    if (event.type !== 'SET_GRAPHQL_DEFINITIONS') {
      ctx.reporter?.warn('[typegen] action `assignThirdPartyFragmentDefinitions` is only allowed in `SET_GRAPHQL_DEFINITIONS` event');
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
};

export type TypegenTransitionGuardName = (
  | 'hasSchemaAndDefinitions?'
);

export type TypegenTransitionGuardConfig = Record<
  TypegenTransitionGuardName,
  ConditionPredicate<TypegenContext, TypegenEvent>
>;

const typegenTransitionGuards: TypegenTransitionGuardConfig = {
  'hasSchemaAndDefinitions?': context => Boolean(context.schema && context.trackedDefinitions),
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
    reporter: null,
    schema: null,
    trackedDefinitions: null,
    thirdpartyFragmentDefinitions: [],
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
          target: 'emitting',
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
    emitting: {
      type: 'parallel',
      on: {
        SET_SCHEMA: [
          {
            actions: action('assignSchema'),
          },
        ],
        SET_GRAPHQL_DEFINITIONS: [
          {
            actions: action('assignTrackedDefinitions'),
          },
        ],
      },
      states: {
        emitSchema: {
          on: {
            SCHEDULE_NEXT_WORK: '.pending',
          },
          initial: 'idle',
          states: {
            idle: {},
            pending: {
              invoke: {
                src: service('emitSchema'),
                onDone: 'idle',
              },
            },
          },
        },
        codegen: {
          on: {
            SCHEDULE_NEXT_WORK: {
            },
          },
          initial: 'idle',
          states: {
            idle: {},
            pending: {
              invoke: {
                src: service('codegen'),
                onDone: 'idle',
              },
            },
          },
        },
        autoFixCodes: {
          on: {
            SCHEDULE_NEXT_WORK: {
            },
          },
          initial: 'idle',
          states: {
            idle: {},
            pending: {
              invoke: {
                src: service('autoFixCodes'),
                onDone: 'idle',
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

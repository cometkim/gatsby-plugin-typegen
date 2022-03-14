import _ from 'lodash';
import type { GraphQLSchema } from 'gatsby/graphql';
import type { DoneInvokeEvent } from 'xstate';
import { createMachine, actions } from 'xstate';

import type { TypegenReporter } from './reporter';
import type { Config } from './config';
import type { IDefinitionMeta, FragmentDefinition } from './utils';
import {
  stabilizeSchema,
  definitionIsEqual,
  isTargetDefinition,
  isThirdpartyFragment,
} from './utils';

type DefinitionName = string;
type DefinitionMap = Map<DefinitionName, IDefinitionMeta>;

type Context = {
  config: Config,
  debouncingDelay: number,
  reporter: TypegenReporter,
  devMode: boolean,
  trackedDefinitions?: DefinitionMap,
  thirdpartyFragments?: FragmentDefinition[],
  schema?: GraphQLSchema,
};

type Event = (
  | { type: 'SET_SCHEMA', schema: GraphQLSchema }
  | { type: 'SET_GRAPHQL_DEFINITIONS', definitions: DefinitionMap }
  | { type: 'CREATE_DEV_SERVER' }

  | { type: 'CHANGE_SCHEMA', schema: GraphQLSchema }
  | { type: 'CHANGE_GRAPHQL_DEFINITIONS', definitions: DefinitionMap }

  | { type: 'CHECK_IF_READY' }

  | { type: 'START_emitSchema', schema: GraphQLSchema }
  | { type: 'DONE_emitSchema' }

  | { type: 'START_codegen', schema: GraphQLSchema, definitions: DefinitionMap }
  | { type: 'DONE_codegen' }

  | { type: 'START_autofix', files?: string[] }
  | { type: 'DONE_autofix' }
);

type PickEvent<T extends Event['type']> = Extract<Event, { type: T }>;

export const typegenMachine = createMachine({
  tsTypes: {} as import('./machine.typegen').Typegen0,
  schema: {
    context: {} as Context,
    events: {} as Event,
  },
  initial: 'initializing',
  on: {
    CREATE_DEV_SERVER: {
      actions: 'assignDevMode',
    },
  },
  states: {
    initializing: {
      type: 'parallel',
      on: {
        SET_SCHEMA: {
          actions: [
            'assignSchema',
            actions.send<Context, PickEvent<'SET_SCHEMA'>>('CHECK_IF_READY'),
          ],
        },
        SET_GRAPHQL_DEFINITIONS: {
          actions: [
            'assignThirdpartyDefinitions',
            'assignDefinitions',
            actions.send<Context, PickEvent<'SET_GRAPHQL_DEFINITIONS'>>('CHECK_IF_READY'),
          ],
        },
        CHECK_IF_READY: {
          cond: 'ready?',
          target: 'runningOnce',
        },
      },
    },
    runningOnce: {
      initial: 'running',
      states: {
        running: {
          type: 'parallel',
          states: {
            emitSchema: {
              initial: 'running',
              states: {
                running: {
                  invoke: {
                    src: 'emitSchema',
                    onDone: 'done',
                    onError: {
                      target: 'done',
                      actions: 'reportEmitSchemaError',
                    },
                  },
                },
                done: {
                  type: 'final',
                },
              },
            },
            emitPluginDocument: {
              initial: 'running',
              states: {
                running: {
                  invoke: {
                    src: 'emitPluginDocument',
                    onDone: 'done',
                    onError: {
                      target: 'done',
                      actions: 'reportEmitPluginDocumentError',
                    },
                  },
                },
                done: {
                  type: 'final',
                },
              },
            },
            codegen: {
              initial: 'running',
              states: {
                running: {
                  invoke: {
                    src: 'codegen',
                    onDone: 'done',
                    onError: {
                      target: 'done',
                      actions: 'reportCodegenError',
                    },
                  },
                },
                done: {
                  type: 'final',
                },
              },
            },
            autofix: {
              initial: 'running',
              states: {
                running: {
                  invoke: {
                    src: 'autofix',
                    onDone: 'done',
                    onError: {
                      target: 'done',
                      actions: 'reportAutofixError',
                    },
                  },
                },
                done: {
                  type: 'final',
                },
              },
            },
          },
          onDone: [
            {
              cond: 'devMode?',
              target: '#watching',
            },
            {
              target: 'idle',
            },
          ],
        },
        idle: {
          on: {
            CREATE_DEV_SERVER: '#watching',
          },
        },
      },
    },
    watching: {
      type: 'parallel',
      id: 'watching',
      states: {
        schedulers: {
          on: {
            SET_SCHEMA: {
              cond: 'hasSchemaChanged?',
              actions: 'onSchemaChange',
            },
            CHANGE_SCHEMA: {
              actions: 'assignSchema',
            },
            SET_GRAPHQL_DEFINITIONS: {
              cond: 'hasDefinitionsChanged?',
              actions: 'onDefinitionsChange',
            },
            CHANGE_GRAPHQL_DEFINITIONS: {
              actions: 'assignDefinitions',
            },
          },
        },
        jobs: {
          type: 'parallel',
          states: {
            emitSchema: {
              initial: 'idle',
              states: {
                idle: {
                  on: {
                    START_emitSchema: 'running',
                  },
                },
                running: {
                  invoke: {
                    src: 'emitSchema',
                    onDone: {
                      target: 'idle',
                      actions: actions.send<Context, DoneInvokeEvent<unknown>>('DONE_emitSchema'),
                    },
                    onError: {
                      target: 'idle',
                      actions: [
                        'reportEmitSchemaError',
                        actions.send<Context, DoneInvokeEvent<unknown>>('DONE_emitSchema'),
                      ],
                    },
                  },
                },
              },
            },
            codegen: {
              initial: 'idle',
              states: {
                idle: {
                  on: {
                    START_codegen: 'running',
                  },
                },
                running: {
                  invoke: {
                    src: 'codegen',
                    onDone: {
                      target: 'idle',
                      actions: actions.send<Context, DoneInvokeEvent<unknown>>('DONE_codegen'),
                    },
                    onError: {
                      target: 'idle',
                      actions: [
                        'reportCodegenError',
                        actions.send<Context, DoneInvokeEvent<unknown>>('DONE_codegen'),
                      ],
                    },
                  },
                },
              },
            },
            autofix: {
              initial: 'idle',
              states: {
                idle: {
                  on: {
                    START_autofix: 'running',
                  },
                },
                running: {
                  invoke: {
                    src: 'autofix',
                    onDone: {
                      target: 'idle',
                      actions: actions.send<Context, DoneInvokeEvent<unknown>>('DONE_autofix'),
                    },
                    onError: {
                      target: 'idle',
                      actions: [
                        'reportAutofixError',
                        actions.send<Context, DoneInvokeEvent<unknown>>('DONE_autofix'),
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}, {
  guards: {
    'devMode?': context => Boolean(context.devMode),
    'ready?': context => Boolean(context.schema && context.trackedDefinitions && context.thirdpartyFragments),
    'hasSchemaChanged?': (context, event) => context.schema !== event.schema,
    'hasDefinitionsChanged?': (context, event) => {
      const changes = _.differenceWith(
        [...context.trackedDefinitions?.values() || []],
        extractTargetDefinitions(event.definitions),
        definitionIsEqual,
      );
      return changes.length !== 0;
    },
  },
  actions: {
    assignDevMode: actions.assign({
      devMode: _context => true,
    }),
    assignSchema: actions.assign({
      schema: (_context, event) => stabilizeSchema(event.schema),
    }),
    assignThirdpartyDefinitions: actions.assign({
      thirdpartyFragments: (_context, event) => extractThirdpartyDefinitions(event.definitions),
    }),
    assignDefinitions: actions.assign({
      trackedDefinitions: (_context, event) => filterTargetDefinitions(event.definitions),
    }),
    onSchemaChange: actions.pure((_context, event) => {
      const { schema } = event;

      const emitSchemaJobId = 'SCHEDULED_emitSchema';

      return [
        actions.send({ type: 'CHANGE_SCHEMA', schema }),

        actions.cancel(emitSchemaJobId),
        actions.send<Context, PickEvent<'SET_SCHEMA'>>(
          { type: 'START_emitSchema', schema },
          {
            id: emitSchemaJobId,
            delay: context => context.debouncingDelay,
          },
        ),
      ];
    }),
    onDefinitionsChange: actions.pure((context, event) => {
      const {
        schema,
        trackedDefinitions,
        debouncingDelay,
      } = context;
      const { definitions } = event;

      const changes = _.differenceWith(
        [...trackedDefinitions?.values() || []],
        extractTargetDefinitions(definitions),
        definitionIsEqual,
      );

      const codegenJobId = 'SCHEDULED_codegen';
      const autofixJobId = 'SCHEDULED_autofix';

      return [
        actions.send({ type: 'CHANGE_GRAPHQL_DEFINITIONS', definitions }),

        actions.cancel(codegenJobId),
        actions.send<Context, PickEvent<'SET_GRAPHQL_DEFINITIONS'>>(
          { type: 'START_codegen', schema, definitions },
          {
            id: codegenJobId,
            delay: debouncingDelay,
          },
        ),

        actions.cancel(autofixJobId),
        actions.send<Context, PickEvent<'SET_GRAPHQL_DEFINITIONS'>>(
          { type: 'START_autofix', files: changes.map(change => change.filePath) },
          {
            id: autofixJobId,
            delay: debouncingDelay,
          },
        ),
      ];
    }),
  },
});

function extractThirdpartyDefinitions(defMap: DefinitionMap) {
  return [...defMap.values()].filter(isThirdpartyFragment);
}

function extractTargetDefinitions(defMap: DefinitionMap) {
  return [...defMap.values()].filter(isTargetDefinition);
}

function filterTargetDefinitions(defMap: DefinitionMap) {
  const defs: Array<[name: string, def: IDefinitionMeta]> = [];
  for (const [name, def] of defMap) {
    if (isTargetDefinition(def)) {
      defs.push([name, def]);
    }
  }
  return new Map(defs);
}

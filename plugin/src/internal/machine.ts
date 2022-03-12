import type { GraphQLSchema } from 'gatsby/graphql';
import type { DoneInvokeEvent } from 'xstate';
import { createMachine, actions } from 'xstate';

import { TypegenReporter } from './reporter';
import type { IDefinitionMeta } from './utils';

type Context = {
  debouncingDelay: number,
  reporter: TypegenReporter,
  devMode: boolean,
  trackedDefinitions: Map<string, IDefinitionMeta>,
  thirdPartyDefinitions?: IDefinitionMeta[],
  schema?: GraphQLSchema,
};

type Event = (
  | { type: 'CREATE_DEV_SERVER' }
  | { type: 'SET_SCHEMA', schema: GraphQLSchema }
  | { type: 'SET_GRAPHQL_DEFINITIONS', definitions: IDefinitionMeta[] }
  | { type: 'START_emitSchema' }
  | { type: 'DONE_emitSchema' }
  | { type: 'START_codegen' }
  | { type: 'DONE_codegen' }
  | { type: 'START_autofix' }
  | { type: 'DONE_autofix' }
);

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
        SET_SCHEMA: [
          {
            cond: 'ready?',
            actions: 'assignSchema',
            target: 'emitting',
          },
          {
            actions: 'assignSchema',
          },
        ],
        SET_GRAPHQL_DEFINITIONS: [
          {
            cond: 'ready?',
            actions: [
              'assignThirdpartyDefinitions',
              'assignDefinitions',
            ],
            target: 'emitting',
          },
          {
            actions: [
              'assignThirdpartyDefinitions',
              'assignDefinitions',
            ],
          },
        ],
      },
    },
    emitting: {
      states: {
        running: {
          onDone: [
            {
              cond: 'devMode?',
              target: '#watching',
            },
            {
              target: 'idle',
            },
          ],
          invoke: [
            { src: 'emitSchema' },
            { src: 'emitPluginDoucments' },
            { src: 'codegen' },
            { src: 'autofix' },
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
          type: 'parallel',
          initial: 'running',
          states: {
            t1: {
              on: {
                SET_SCHEMA: {
                  actions: [
                    'assignSchema',
                    'scheduleEmitSchema',
                    'scheduleCodegen',
                  ],
                },
                SET_GRAPHQL_DEFINITIONS: {
                  actions: [
                    'assignDefinitions',
                    'scheduleAutofix',
                    'scheduleCodegen',
                  ],
                },
              },
            },
            t2: {
              type: 'parallel',
              states: {
                watchingSchema: {
                  invoke: {
                    src: 'opSchemaChange',
                  },
                },
                watchingDefinitions: {
                  invoke: {
                    src: 'opDefinitionsChange',
                  },
                },
              },
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
    'devMode?': context => Boolean(context?.devMode),
  },
  actions: {
    assignDevMode: actions.assign({
      devMode: _context => true,
    }),
    assignSchema: actions.assign({
      schema: (_context, event) => event.schema,
    }),
    scheduleEmitSchema: actions.pure(() => {
      const jobId = 'SCHEDULED_emitSchema';
      return [
        actions.cancel(jobId),
        actions.send<Context, Event>(
          'START_emitSchema',
          {
            id: jobId,
            delay: context => context.debouncingDelay,
          },
        ),
      ];
    }),
    scheduleCodegen: actions.pure(() => {
      const jobId = 'SCHEDULED_codegen';
      return [
        actions.cancel(jobId),
        actions.send<Context, Event>(
          'START_codegen',
          {
            id: jobId,
            delay: context => context.debouncingDelay,
          },
        ),
      ];
    }),
    scheduleAutofix: actions.pure(() => {
      const jobId = 'SCHEDULED_autofix';
      return [
        actions.cancel(jobId),
        actions.send<Context, Event>(
          'START_codegen',
          {
            id: jobId,
            delay: context => context.debouncingDelay,
          },
        ),
      ];
    }),
  },
  services: {
    opSchemaChange: context => (callback, onReceive) => {
      type LocalContext = {
        schema: GraphQLSchema,
      };
      const local: LocalContext = {
        schema: context.schema!,
      };
      onReceive((e: Event) => {
        switch (e.type) {
          case 'DONE_emitSchema': {
            if (context.schema !== local.schema) {
              callback('START_emitSchema');
            }
            return;
          }
        }
      });
    },
    opDefinitionsChange: context => (callback, onReceive) => {
      type LocalContext = {
      };
      const local: LocalContext = {
      };
      onReceive((e: Event) => {
      });
    },
  },
});

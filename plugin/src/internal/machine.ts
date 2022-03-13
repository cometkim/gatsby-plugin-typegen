import type { GraphQLSchema } from 'gatsby/graphql';
import type { DoneInvokeEvent } from 'xstate';
import { createMachine, actions } from 'xstate';

import { TypegenReporter } from './reporter';
import type { IDefinitionMeta, FragmentDefinition } from './utils';
import {
  stabilizeSchema,
  isFragmentDefinition,
  guessIfThirdpartyDefinition,
  guessIfUnnnamedQuery,
} from './utils';

type Context = {
  debouncingDelay: number,
  reporter: TypegenReporter,
  devMode: boolean,
  trackedDefinitions?: Map<string, IDefinitionMeta>,
  thirdpartyFragments?: FragmentDefinition[],
  schema?: GraphQLSchema,
};

type Event = (
  | { type: 'CREATE_DEV_SERVER' }
  | { type: 'SET_SCHEMA', schema: GraphQLSchema }
  | { type: 'SET_GRAPHQL_DEFINITIONS', definitions: Map<string, IDefinitionMeta> }
  | { type: 'START_emitSchema' }
  | { type: 'DONE_emitSchema' }
  | { type: 'START_codegen' }
  | { type: 'DONE_codegen' }
  | { type: 'START_autofix', files: string[] }
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
        SET_SCHEMA: [
          {
            cond: 'ready?',
            actions: 'assignSchema',
            target: 'runningOnce',
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
            target: 'runningOnce',
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
    runningOnce: {
      states: {
        running: {
          type: 'parallel',
          states: {
            emitSchema: {
              invoke: { src: 'emitSchema' },
            },
            emitPluginDocument: {
              invoke: { src: 'emitPluginDocument' },
            },
            codegen: {
              invoke: { src: 'codegen' },
            },
            autofix: {
              invoke: { src: 'autofix' },
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
    'devMode?': context => Boolean(context.devMode),
    'ready?': context => Boolean(context.schema && context.trackedDefinitions),
  },
  actions: {
    assignDevMode: actions.assign({
      devMode: _context => true,
    }),
    assignSchema: actions.assign({
      schema: (_context, event) => stabilizeSchema(event.schema),
    }),
    assignThirdpartyDefinitions: actions.assign({
      thirdpartyFragments: (_context, event) => {
        return [...event.definitions.values()]
          .filter(isFragmentDefinition)
          .filter(guessIfThirdpartyDefinition);
      },
    }),
    assignDefinitions: actions.assign({
      trackedDefinitions: (_context, event) => {
        const filtered = [...event.definitions.entries()]
          .filter(([_name, def]) => !guessIfUnnnamedQuery(def));
        return new Map(filtered);
      },
    }),
    scheduleEmitSchema: actions.pure(() => {
      const jobId = 'SCHEDULED_emitSchema';
      return [
        actions.cancel(jobId),
        actions.send<Context, PickEvent<'SET_SCHEMA'>>(
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
        actions.send<Context, PickEvent<'SET_SCHEMA' | 'SET_GRAPHQL_DEFINITIONS'>>(
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
        actions.send<Context, PickEvent<'SET_GRAPHQL_DEFINITIONS'>>(
          context => ({ type: 'START_autofix', files: [...context.trackedDefinitions?.keys() || []] }),
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
            if (local.schema !== context.schema) {
              callback('START_emitSchema');
              local.schema = context.schema!;
            }
            return;
          }

          case 'DONE_codegen': {
            if (local.schema !== context.schema) {
              callback('START_codegen');
              local.schema = context.schema!;
            }
            return;
          }
        }
      });
    },
    opDefinitionsChange: context => (callback, onReceive) => {
      type Def = Pick<IDefinitionMeta, 'filePath' | 'hash'>
      let prevCodegenStat = new Map<string, Def>();
      let prevAutofixStat = new Map<string, Def>();

      function getChangeset(stats: Map<string, Def>, definitions: IDefinitionMeta[]) {
        const changed: Def[] = [];

        for (const def of definitions) {
          // added
          if (!stats.has(def.name)) {
            changed.push({ filePath: def.filePath, hash: def.hash });
          }

          // modified
          if (stats.has(def.name) && stats.get(def.name)?.hash !== def.hash) {
            changed.push({ filePath: def.filePath, hash: def.hash });
          }
        }

        for (const [existName, existDef] of stats.entries()) {
          // deleted
          const existence = definitions.find(def => def.name === existName);
          if (existence) {
            changed.push(existDef);
          }
        }

        return changed;
      }

      onReceive((e: Event) => {
        switch (e.type) {
          case 'START_codegen': {
            prevCodegenStat = new Map(
              [...context.trackedDefinitions?.values() || []]
              .map(({ name, hash, filePath }) => [name, { hash, filePath }] as const)
            );
            break;
          }
          case 'DONE_codegen': {
            const definitions = [...context.trackedDefinitions?.values() || []];
            const changeset = getChangeset(prevCodegenStat, definitions);
            if (changeset.length > 0) {
              callback('START_codegen');
            }
            break;
          }

          case 'START_autofix': {
            prevAutofixStat = new Map(
              [...context.trackedDefinitions?.values() || []]
              .map(({ name, hash, filePath }) => [name, { hash, filePath }] as const)
            );
            break;
          }
          case 'DONE_autofix': {
            const definitions = [...context.trackedDefinitions?.values() || []];
            const changeset = getChangeset(prevAutofixStat, definitions);
            if (changeset.length > 0) {
              callback({ type: 'START_autofix', files: changeset.map(change => change.filePath) });
            }
            break;
          }
        }
      });
    },
  },
});

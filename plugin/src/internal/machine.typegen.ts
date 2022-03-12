// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    assignDevMode: "CREATE_DEV_SERVER";
    assignSchema: "SET_SCHEMA";
    assignPluginDefinitions: "SET_GRAPHQL_DEFINITIONS";
    assignDefinitions: "SET_GRAPHQL_DEFINITIONS";
    scheduleEmitSchema: "SET_SCHEMA";
    scheduleCodegen: "SET_SCHEMA" | "SET_GRAPHQL_DEFINITIONS";
    scheduleAutofix: "SET_GRAPHQL_DEFINITIONS";
  };
  internalEvents: {
    "done.invoke.(machine).watching.jobs.emitSchema.running:invocation[0]": {
      type: "done.invoke.(machine).watching.jobs.emitSchema.running:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.(machine).watching.jobs.codegen.running:invocation[0]": {
      type: "done.invoke.(machine).watching.jobs.codegen.running:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.(machine).watching.jobs.autofix.running:invocation[0]": {
      type: "done.invoke.(machine).watching.jobs.autofix.running:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    emitSchema:
      | "done.invoke.(machine).emitting.running:invocation[0]"
      | "done.invoke.(machine).watching.jobs.emitSchema.running:invocation[0]";
    emitPluginDoucments: "done.invoke.(machine).emitting.running:invocation[1]";
    codegen:
      | "done.invoke.(machine).emitting.running:invocation[2]"
      | "done.invoke.(machine).watching.jobs.codegen.running:invocation[0]";
    autofix:
      | "done.invoke.(machine).emitting.running:invocation[3]"
      | "done.invoke.(machine).watching.jobs.autofix.running:invocation[0]";
    opSchemaChange: "done.invoke.(machine).watching.schedulers.t2.watchingSchema:invocation[0]";
    opDefinitionsChange: "done.invoke.(machine).watching.schedulers.t2.watchingDefinitions:invocation[0]";
  };
  missingImplementations: {
    actions: "assignPluginDefinitions" | "assignDefinitions";
    services: "emitSchema" | "emitPluginDoucments" | "codegen" | "autofix";
    guards: "ready?";
    delays: never;
  };
  eventsCausingServices: {
    emitSchema: "START_emitSchema";
    emitPluginDoucments: "xstate.init";
    codegen: "START_codegen";
    autofix: "START_autofix";
    opSchemaChange: "xstate.init";
    opDefinitionsChange: "xstate.init";
  };
  eventsCausingGuards: {
    "ready?": "SET_SCHEMA" | "SET_GRAPHQL_DEFINITIONS";
    "devMode?": "done.state.(machine).emitting.running";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "initializing"
    | "emitting"
    | "emitting.running"
    | "emitting.idle"
    | "watching"
    | "watching.schedulers"
    | "watching.schedulers.t1"
    | "watching.schedulers.t2"
    | "watching.schedulers.t2.watchingSchema"
    | "watching.schedulers.t2.watchingDefinitions"
    | "watching.jobs"
    | "watching.jobs.emitSchema"
    | "watching.jobs.emitSchema.idle"
    | "watching.jobs.emitSchema.running"
    | "watching.jobs.codegen"
    | "watching.jobs.codegen.idle"
    | "watching.jobs.codegen.running"
    | "watching.jobs.autofix"
    | "watching.jobs.autofix.idle"
    | "watching.jobs.autofix.running"
    | {
        emitting?: "running" | "idle";
        watching?:
          | "schedulers"
          | "jobs"
          | {
              schedulers?:
                | "t1"
                | "t2"
                | { t2?: "watchingSchema" | "watchingDefinitions" };
              jobs?:
                | "emitSchema"
                | "codegen"
                | "autofix"
                | {
                    emitSchema?: "idle" | "running";
                    codegen?: "idle" | "running";
                    autofix?: "idle" | "running";
                  };
            };
      };
  tags: never;
}

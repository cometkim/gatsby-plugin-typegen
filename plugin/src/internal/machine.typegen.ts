// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    assignDevMode: "CREATE_DEV_SERVER";
    assignSchema: "SET_SCHEMA" | "CHANGE_SCHEMA";
    assignThirdpartyDefinitions: "SET_GRAPHQL_DEFINITIONS";
    assignDefinitions: "SET_GRAPHQL_DEFINITIONS" | "CHANGE_GRAPHQL_DEFINITIONS";
    reportEmitSchemaError:
      | "error.platform.(machine).runningOnce.running.emitSchema.running:invocation[0]"
      | "error.platform.(machine).watching.jobs.emitSchema.running:invocation[0]";
    reportEmitPluginDocumentError: "error.platform.(machine).runningOnce.running.emitPluginDocument.running:invocation[0]";
    reportCodegenError:
      | "error.platform.(machine).runningOnce.running.codegen.running:invocation[0]"
      | "error.platform.(machine).watching.jobs.codegen.running:invocation[0]";
    reportAutofixError:
      | "error.platform.(machine).runningOnce.running.autofix.running:invocation[0]"
      | "error.platform.(machine).watching.jobs.autofix.running:invocation[0]";
    onSchemaChange: "SET_SCHEMA";
    onDefinitionsChange: "SET_GRAPHQL_DEFINITIONS";
  };
  internalEvents: {
    "error.platform.(machine).runningOnce.running.emitSchema.running:invocation[0]": {
      type: "error.platform.(machine).runningOnce.running.emitSchema.running:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).watching.jobs.emitSchema.running:invocation[0]": {
      type: "error.platform.(machine).watching.jobs.emitSchema.running:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).runningOnce.running.emitPluginDocument.running:invocation[0]": {
      type: "error.platform.(machine).runningOnce.running.emitPluginDocument.running:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).runningOnce.running.codegen.running:invocation[0]": {
      type: "error.platform.(machine).runningOnce.running.codegen.running:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).watching.jobs.codegen.running:invocation[0]": {
      type: "error.platform.(machine).watching.jobs.codegen.running:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).runningOnce.running.autofix.running:invocation[0]": {
      type: "error.platform.(machine).runningOnce.running.autofix.running:invocation[0]";
      data: unknown;
    };
    "error.platform.(machine).watching.jobs.autofix.running:invocation[0]": {
      type: "error.platform.(machine).watching.jobs.autofix.running:invocation[0]";
      data: unknown;
    };
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
      | "done.invoke.(machine).runningOnce.running.emitSchema.running:invocation[0]"
      | "done.invoke.(machine).watching.jobs.emitSchema.running:invocation[0]";
    emitPluginDocument: "done.invoke.(machine).runningOnce.running.emitPluginDocument.running:invocation[0]";
    codegen:
      | "done.invoke.(machine).runningOnce.running.codegen.running:invocation[0]"
      | "done.invoke.(machine).watching.jobs.codegen.running:invocation[0]";
    autofix:
      | "done.invoke.(machine).runningOnce.running.autofix.running:invocation[0]"
      | "done.invoke.(machine).watching.jobs.autofix.running:invocation[0]";
  };
  missingImplementations: {
    actions:
      | "reportEmitSchemaError"
      | "reportEmitPluginDocumentError"
      | "reportCodegenError"
      | "reportAutofixError";
    services: "emitSchema" | "emitPluginDocument" | "codegen" | "autofix";
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    emitSchema: "START_emitSchema";
    emitPluginDocument: "xstate.init";
    codegen: "START_codegen";
    autofix: "START_autofix";
  };
  eventsCausingGuards: {
    "ready?": "CHECK_IF_READY";
    "devMode?": "done.state.(machine).runningOnce.running";
    "hasSchemaChanged?": "SET_SCHEMA";
    "hasDefinitionsChanged?": "SET_GRAPHQL_DEFINITIONS";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "initializing"
    | "runningOnce"
    | "runningOnce.running"
    | "runningOnce.running.emitSchema"
    | "runningOnce.running.emitSchema.running"
    | "runningOnce.running.emitSchema.done"
    | "runningOnce.running.emitPluginDocument"
    | "runningOnce.running.emitPluginDocument.running"
    | "runningOnce.running.emitPluginDocument.done"
    | "runningOnce.running.codegen"
    | "runningOnce.running.codegen.running"
    | "runningOnce.running.codegen.done"
    | "runningOnce.running.autofix"
    | "runningOnce.running.autofix.running"
    | "runningOnce.running.autofix.done"
    | "runningOnce.idle"
    | "watching"
    | "watching.schedulers"
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
        runningOnce?:
          | "running"
          | "idle"
          | {
              running?:
                | "emitSchema"
                | "emitPluginDocument"
                | "codegen"
                | "autofix"
                | {
                    emitSchema?: "running" | "done";
                    emitPluginDocument?: "running" | "done";
                    codegen?: "running" | "done";
                    autofix?: "running" | "done";
                  };
            };
        watching?:
          | "schedulers"
          | "jobs"
          | {
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

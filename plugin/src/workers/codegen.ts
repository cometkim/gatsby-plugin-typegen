import type { Reporter } from "gatsby";
import type { GraphQLSchema } from "gatsby/graphql";
import type { QueueObject } from "async";
import type { Callable } from "@cometjs/core";
import type { Source } from "@graphql-tools/utils";
import type { TypeScriptPluginConfig } from "@graphql-codegen/typescript/config";
import type { TypeScriptDocumentsPluginConfig } from "@graphql-codegen/typescript-operations/config";
import type { TypeScriptResolversPluginConfig } from "@graphql-codegen/typescript-resolvers/config";
import type { FlowPluginConfig } from "@graphql-codegen/flow/config";
import type { FlowDocumentsPluginConfig } from "@graphql-codegen/flow-operations/config";
// no exposed types
// import type { FlowResolversPluginConfig } from '@graphql-codegen/flow-resolvers/config';
import type { RequiredPluginOptions } from "../plugin-utils";

import { cargo, asyncify } from "async";
import { codegen } from "@graphql-codegen/core";

import { delay, writeFile, formatLanguage } from "../common";

const CARGO_DELAY = 1000 as const;

// Preset configurations to ensure compatibility with Gatsby.
const DEFAULT_SHARED_CONFIG = {
  namingConvention: {
    typeNames: "keep",
    enumValues: "keep",
    transformUnderscore: false,
  },
  addUnderscoreToArgsType: true,
  skipTypename: true,
  scalars: {
    typescript: {
      // A date string, such as 2007-12-03, compliant with the ISO 8601 standard for
      // representation of dates and times using the Gregorian calendar.
      Date: "string",

      // The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
      // Note: This will never be used since this is reserved by GatsbyJS internal
      JSON: "never",
    },
    flow: {
      // A date string, such as 2007-12-03, compliant with the ISO 8601 standard for
      // representation of dates and times using the Gregorian calendar.
      Date: "string",

      // The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
      // Note: This will never be used since this is reserved by GatsbyJS internal
      JSON: "any",
    },
  },
} as const;

const DEFAULT_TYPESCRIPT_CONFIG: Readonly<TypeScriptPluginConfig> = {
  avoidOptionals: true,
  immutableTypes: true,
  maybeValue: "T | undefined",
  noExport: true,
  enumsAsTypes: true,
};

const DEFAULT_TYPESCRIPT_OPERATIONS_CONFIG: Readonly<TypeScriptDocumentsPluginConfig> = {
  ...DEFAULT_TYPESCRIPT_CONFIG,
  exportFragmentSpreadSubTypes: true,
};

const DEFAULT_TYPESCRIPT_RESOLVERS_CONFIG: Readonly<TypeScriptResolversPluginConfig> = {
  // See https://github.com/dotansimha/graphql-code-generator/pull/5458
  // ...DEFAULT_TYPESCRIPT_CONFIG,
  contextType: "gatsby-plugin-typegen/types#GatsbyResolverContext",
};

const DEFAULT_FLOW_CONFIG: Readonly<FlowPluginConfig> = {
  useFlowExactObjects: true,
  useFlowReadOnlyTypes: true,
};

const DEFAULT_FLOW_OPERATIONS_CONFIG: Readonly<FlowDocumentsPluginConfig> = {
  ...DEFAULT_FLOW_CONFIG,
  exportFragmentSpreadSubTypes: true,
};

const DEFAULT_FLOW_RESOLVERS_CONFIG: Readonly<FlowPluginConfig> = {
  ...DEFAULT_FLOW_CONFIG,
  // FIXME: add config for contextType
};

export type CodegenTask = {
  schema: GraphQLSchema;
  documents: Source[];
};

interface SetupCodegenWorkerFn {
  (props: {
    reporter: Reporter;
    language: RequiredPluginOptions["language"];
    namespace: string;
    outputPath: string;
    includeResolvers: boolean;
    scalarMap: { [typename: string]: string };
  }): QueueObject<CodegenTask>;
}
export const setupCodegenWorker: SetupCodegenWorkerFn = ({
  outputPath,
  language,
  namespace,
  includeResolvers,
  scalarMap,
  reporter,
}) => {
  const worker = cargo<CodegenTask>(
    asyncify(async (tasks: CodegenTask[]) => {
      const { length: l, [l - 1]: last } = tasks;
      const { schema: schemaAst, documents } = last;

      type CodegenOptions = Parameters<typeof codegen>[0];
      const codegenOptions: CodegenOptions = {
        // eslint-disable-next-line
        schema: undefined as any,
        schemaAst,
        documents,
        filename: outputPath,
        config: {
          ...DEFAULT_SHARED_CONFIG,
          scalars: {
            ...DEFAULT_SHARED_CONFIG.scalars[language],
            ...scalarMap,
          },
        },
        plugins: [],
        pluginMap: {},
      };
      type CodegenPlugin = CodegenOptions["pluginMap"][string];
      if (language === "typescript") {
        codegenOptions.plugins.push({ typescript: DEFAULT_TYPESCRIPT_CONFIG });
        codegenOptions.pluginMap[
          "typescript"
        ] = require("@graphql-codegen/typescript") as CodegenPlugin;

        codegenOptions.plugins.push({
          typescriptOperations: DEFAULT_TYPESCRIPT_OPERATIONS_CONFIG,
        });
        codegenOptions.pluginMap[
          "typescriptOperations"
        ] = require("@graphql-codegen/typescript-operations") as CodegenPlugin;

        if (includeResolvers) {
          codegenOptions.plugins.push({
            typescriptResolvers: DEFAULT_TYPESCRIPT_RESOLVERS_CONFIG,
          });
          codegenOptions.pluginMap[
            "typescriptResolvers"
          ] = require("@graphql-codegen/typescript-resolvers") as CodegenPlugin;
        }
      } /* flow */ else {
        const flow: FlowPluginConfig = {
          ...DEFAULT_FLOW_CONFIG,
          typesPrefix: `${namespace}$`,
        };
        codegenOptions.plugins.push({ flow });
        codegenOptions.pluginMap[
          "flow"
        ] = require("@graphql-codegen/flow") as CodegenPlugin;

        const flowOperations: FlowDocumentsPluginConfig = {
          ...DEFAULT_FLOW_OPERATIONS_CONFIG,
          typesPrefix: `${namespace}$`,
        };
        codegenOptions.plugins.push({ flowOperations });
        codegenOptions.pluginMap[
          "flowOperations"
        ] = require("@graphql-codegen/flow-operations") as CodegenPlugin;

        if (includeResolvers) {
          const flowResolvers: FlowPluginConfig = {
            ...DEFAULT_FLOW_RESOLVERS_CONFIG,
            typesPrefix: `${namespace}$`,
          };
          codegenOptions.plugins.push({ flowResolvers });
          codegenOptions.pluginMap[
            "flowResolvers"
          ] = require("@graphql-codegen/flow-resolvers") as CodegenPlugin;
        }
      }

      reporter.verbose(
        `[typegen] Generate type definitions to ${outputPath}. (language: ${formatLanguage(
          language
        )})`
      );

      try {
        let result = await codegen(codegenOptions);

        if (language === "typescript") {
          result = `declare namespace ${namespace} {\n${result}\n}`;
        } /* flow */ else {
          const FLOW_FILE_TOP = "/* @flow */\n\n";
          const FLOW_FILE_TOP_REGEXP = /\/\*\s*@flow\s*\*\/\s*/;
          result = result.replace(
            FLOW_FILE_TOP_REGEXP,
            FLOW_FILE_TOP + "opaque type never = mixed;\n\n"
          );

          const TYPEDEF_EXPORT_NODE_REGEXP = /export type ((.*)(\{\|?|;)($|\s))/g;
          result = result.replace(
            TYPEDEF_EXPORT_NODE_REGEXP,
            "declare type $1"
          );
        }

        result = "/* eslint-disable */\n\n" + result;

        await writeFile(outputPath, result);
      } catch (e) {
        reporter.panicOnBuild("[typegen] An error on codegen", e);
      }

      return delay(CARGO_DELAY);
    })
  );

  return worker;
};

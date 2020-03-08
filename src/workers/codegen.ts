import { Reporter } from 'gatsby';
import { GraphQLSchema } from 'gatsby/graphql';
import { cargo, asyncify, AsyncCargo } from 'async';
import { codegen } from '@graphql-codegen/core';
import { Source } from '@graphql-toolkit/common';

import { delay, writeFile, formatLanguage } from '../common';
import { RequiredPluginOptions } from '../plugin-utils';

const CARGO_DELAY = 1000 as const;

const TYPEDEF_EXPORT_NODE_REGEXP = /export type ((.*)(\{\|?|;)($|\s))/g;
const TYPEDEF_EXPORT_NODE_REPLACER = 'declare type $1';

// Preset configurations to ensure compatibility with Gatsby.
const DEFAULT_SHARED_CONFIG = {
  namingConvention: {
    typeNames: 'keep',
    enumValues: 'keep',
    transformUnderscore: false,
  },
  addUnderscoreToArgsType: true,
  skipTypename: true,
} as const;

const DEFAULT_TYPESCRIPT_CONFIG = {
  avoidOptionals: true,
  immutableTypes: true,
  maybeValue: 'T | undefined',
  noExport: true,
} as const;

const DEFAULT_FLOW_CONFIG = {
  useFlowExactObject: true,
  useFlowReadOnlyTypes: true,
} as const;

export type CodegenTask = {
  documents: Source[],
};

export type CodegenWorker = Omit<AsyncCargo, 'push'> & {
  push(task: CodegenTask, cb?: Function): void,
};

interface SetupCodegenWorkerFn {
  (props: {
    schemaAst: GraphQLSchema,
    reporter: Reporter,
    language: RequiredPluginOptions['language'],
    namespace: string,
    outputPath: string,
    includeResolvers: boolean,
  }): CodegenWorker;
}
export const setupCodegenWorker: SetupCodegenWorkerFn = ({
  schemaAst,
  outputPath,
  language,
  namespace,
  includeResolvers,
  reporter,
}) => {
  const worker = cargo(asyncify(async (tasks: CodegenTask[]) => {
    const { length: l, [l - 1]: last } = tasks;
    const { documents } = last;

    type CodegenOptions = Parameters<typeof codegen>[0];
    const codegenOptions: CodegenOptions  = {
      schema: undefined as any,
      schemaAst,
      documents,
      filename: outputPath,
      config: DEFAULT_SHARED_CONFIG,
      plugins: [],
      pluginMap: {},
    };
    if (language === 'typescript') {
      codegenOptions.pluginMap['typescript'] = require('@graphql-codegen/typescript');
      codegenOptions.plugins.push({
        typescript: {
          ...DEFAULT_TYPESCRIPT_CONFIG,
        },
      });
      codegenOptions.pluginMap['typescriptOperations'] = require('@graphql-codegen/typescript-operations');
      codegenOptions.plugins.push({
        typescriptOperations: {
          ...DEFAULT_TYPESCRIPT_CONFIG,
          // See https://github.com/cometkim/gatsby-plugin-typegen/issues/45
          exportFragmentSpreadSubTypes: true,
        }
      });
      if (includeResolvers) {
        codegenOptions.pluginMap['typescriptResolvers'] = require('@graphql-codegen/typescript-resolvers');
        codegenOptions.plugins.push({
          typescriptResolvers: {
            contextType: 'gatsby-plugin-typegen/types#GatsbyResolverContext',
          },
        });
      }
    } else /* flow */ {
      codegenOptions.pluginMap['flow'] = require('@graphql-codegen/flow');
      codegenOptions.plugins.push({
        flow: {
          ...DEFAULT_FLOW_CONFIG,
          typesPrefix: `${namespace}$`,
        },
      });
      codegenOptions.pluginMap['flowOperations'] = require('@graphql-codegen/flow-operations');
      codegenOptions.plugins.push({
        flowOperations: {
          ...DEFAULT_FLOW_CONFIG,
          // See https://github.com/cometkim/gatsby-plugin-typegen/issues/45
          exportFragmentSpreadSubTypes: true,
          typesPrefix: `${namespace}$`,
        }
      });
      if (includeResolvers) {
        codegenOptions.pluginMap['flowResolvers'] = require('@graphql-codegen/flow-resolvers');
        // Where is contextType option????? WHERE
        codegenOptions.plugins.push({
          flowResolvers: {
            typesPrefix: `${namespace}$`,
          },
        });
      }
    }

    reporter.verbose(`[typegen] Generate type definitions to ${outputPath}. (language: ${formatLanguage(language)})`);

    try {
      let result = await codegen(codegenOptions);

      if (language === 'typescript') {
        result = `declare namespace ${namespace} {\n${result}\n}`;
      } else /* flow */ {
        result = result.replace(TYPEDEF_EXPORT_NODE_REGEXP, TYPEDEF_EXPORT_NODE_REPLACER)
      }

      result = '/* eslint-disable */\n\n' + result;

      await writeFile(outputPath, result);
    } catch (e) {
      reporter.panicOnBuild('[typegen] An error on codegen', e);
    }

    return delay(CARGO_DELAY);
  }));

  return worker;
};

import { Reporter } from 'gatsby';
import { GraphQLSchema } from 'gatsby/graphql';
import { cargo, asyncify, AsyncCargo } from 'async';
import { codegen } from '@graphql-codegen/core';
import { Source } from '@graphql-toolkit/common';

import { delay, writeFile, formatLanguage } from '../common';
import { RequiredPluginOptions } from '../plugin-utils';

const CARGO_DELAY = 1000 as const;

// const TYPEDEF_EXPORT_NODE_REGEXP = /export((.*)(\{|;)($|\s))/g;
// const TYPEDEF_EXPORT_NODE_REPLACER = 'declare$1';

// const TYPEDEF_MAYBE_NODE_REGEXP = /.*(type Maybe)/;
// const TYPEDEF_MAYBE_NODE_REPLACER = '$1';

// const TYPEDEF_SCALARS_NODE_REGEXP = /.*(type Scalars)/;
// const TYPEDEF_SCALARS_NODE_REPLACER = '$1';

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
    outputPath: string,
    languageOption: RequiredPluginOptions['languageOption'],
    includeResolvers: boolean,
  }): CodegenWorker;
}
export const setupCodegenWorker: SetupCodegenWorkerFn = ({
  schemaAst,
  outputPath,
  languageOption: {
    language,
    scope,
    prefix: typesPrefix,
    kind: declarationKind,
  },
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
          typesPrefix,
          declarationKind,
        },
      });
      codegenOptions.pluginMap['typescriptOperations'] = require('@graphql-codegen/typescript-operations');
      codegenOptions.plugins.push({
        typescriptOperations: {
          ...DEFAULT_TYPESCRIPT_CONFIG,
          typesPrefix,
          declarationKind,
          // See https://github.com/cometkim/gatsby-plugin-typegen/issues/45
          exportFragmentSpreadSubTypes: true,
        }
      });
      if (includeResolvers) {
        codegenOptions.pluginMap['typescriptResolvers'] = require('@graphql-codegen/typescript-resolvers');
        codegenOptions.plugins.push({
          typescriptResolvers: {
            contextType: 'gatsby-plugin-typegen/types#GatsbyResolverContext',
            typesPrefix,
            // FIXME: Expected this option exist for this plugin, but it doesn't (shrug)
            // declarationKind,
          },
        });
      }
    } else /* flow */ {
      codegenOptions.pluginMap['flow'] = require('@graphql-codegen/flow');
      codegenOptions.plugins.push({
        flow: {
          ...DEFAULT_FLOW_CONFIG,
          typesPrefix,
          declarationKind,
        },
      });
      codegenOptions.pluginMap['flowOperations'] = require('@graphql-codegen/flow-operations');
      codegenOptions.plugins.push({
        flowOperations: {
          ...DEFAULT_FLOW_CONFIG,
          typesPrefix,
          declarationKind,
          // See https://github.com/cometkim/gatsby-plugin-typegen/issues/45
          exportFragmentSpreadSubTypes: true,
        }
      });
      if (includeResolvers) {
        codegenOptions.pluginMap['flowResolvers'] = require('@graphql-codegen/flow-resolvers');
        // Where is contextType option????? WHERE
        codegenOptions.plugins.push({
          flowResolvers: {
            typesPrefix,
            declarationKind,
          },
        });
      }
    }

    reporter.verbose(`[typegen] Generate type definitions to ${outputPath}. (language: ${formatLanguage(language)})`);

    try {
      let result = await codegen(codegenOptions);

      result = '/* eslint-disable */\n\n' + result;

      // TODO: 구현
      // - global 일 때: export -> declare
      // - namespace 일 때:
      //   1. remove export node
      //   2. create namespace node & wrap
      switch (scope) {
        case 'global':
        case 'namespace':
      }

      // result = result
      //   .replace(TYPEDEF_EXPORT_NODE_REGEXP, TYPEDEF_EXPORT_NODE_REPLACER)
      //   .replace(TYPEDEF_MAYBE_NODE_REGEXP, TYPEDEF_MAYBE_NODE_REPLACER)
      //   .replace(TYPEDEF_SCALARS_NODE_REGEXP, TYPEDEF_SCALARS_NODE_REPLACER);

      await writeFile(outputPath, result);
    } catch (e) {
      reporter.panicOnBuild('[typegen] An error on codegen', e);
    }

    return delay(CARGO_DELAY);
  }));

  return worker;
};

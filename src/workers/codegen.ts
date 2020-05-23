import type { Reporter } from 'gatsby';
import type { GraphQLSchema } from 'gatsby/graphql';
import type { AsyncCargo } from 'async';
import type { Callable } from '@cometjs/core';
import type { Source } from '@graphql-toolkit/common';
import type { RequiredPluginOptions } from '../plugin-utils';

import { cargo, asyncify } from 'async';
import { codegen } from '@graphql-codegen/core';

import {
  delay,
  writeFile,
  formatLanguage,
} from '../common';

const CARGO_DELAY = 1000 as const;

// Preset configurations to ensure compatibility with Gatsby.
const DEFAULT_SHARED_CONFIG = {
  namingConvention: {
    typeNames: 'keep',
    enumValues: 'keep',
    transformUnderscore: false,
  },
  addUnderscoreToArgsType: true,
  skipTypename: true,
  scalars: {
    // A date string, such as 2007-12-03, compliant with the ISO 8601 standard for
    // representation of dates and times using the Gregorian calendar.
    Date: 'string',

    // The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
    // Note: This will never be used since this is reserved by GatsbyJS internal
    JSON: 'never',
  },
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
  schema: GraphQLSchema,
  documents: Source[],
};

export type CodegenWorker = Omit<AsyncCargo, 'push'> & {
  push(task: CodegenTask, cb?: Callable): void,
};

interface SetupCodegenWorkerFn {
  (props: {
    reporter: Reporter,
    language: RequiredPluginOptions['language'],
    namespace: string,
    outputPath: string,
    includeResolvers: boolean,
    scalarMap: { [typename: string]: string },
  }): CodegenWorker;
}
export const setupCodegenWorker: SetupCodegenWorkerFn = ({
  outputPath,
  language,
  namespace,
  includeResolvers,
  scalarMap,
  reporter,
}) => {
  const worker = cargo(asyncify(async (tasks: CodegenTask[]) => {
    const { length: l, [l - 1]: last } = tasks;
    const { schema: schemaAst, documents } = last;

    type CodegenOptions = Parameters<typeof codegen>[0];
    const codegenOptions: CodegenOptions  = {
      // eslint-disable-next-line
      schema: undefined as any,
      schemaAst,
      documents,
      filename: outputPath,
      config: {
        ...DEFAULT_SHARED_CONFIG,
        scalars: {
          ...DEFAULT_SHARED_CONFIG.scalars,
          ...scalarMap,
        },
      },
      plugins: [],
      pluginMap: {},
    };
    type CodegenPlugin = CodegenOptions['pluginMap'][string];
    if (language === 'typescript') {
      codegenOptions.pluginMap['typescript'] = require('@graphql-codegen/typescript') as CodegenPlugin;
      codegenOptions.plugins.push({
        typescript: {
          ...DEFAULT_TYPESCRIPT_CONFIG,
        },
      });
      codegenOptions.pluginMap['typescriptOperations'] = require('@graphql-codegen/typescript-operations') as CodegenPlugin;
      codegenOptions.plugins.push({
        typescriptOperations: {
          ...DEFAULT_TYPESCRIPT_CONFIG,
          // See https://github.com/cometkim/gatsby-plugin-typegen/issues/45
          exportFragmentSpreadSubTypes: true,
        },
      });
      if (includeResolvers) {
        codegenOptions.pluginMap['typescriptResolvers'] = require('@graphql-codegen/typescript-resolvers') as CodegenPlugin;
        codegenOptions.plugins.push({
          typescriptResolvers: {
            contextType: 'gatsby-plugin-typegen/types#GatsbyResolverContext',
          },
        });
      }
    } else /* flow */ {
      codegenOptions.pluginMap['flow'] = require('@graphql-codegen/flow') as CodegenPlugin;
      codegenOptions.plugins.push({
        flow: {
          ...DEFAULT_FLOW_CONFIG,
          typesPrefix: `${namespace}$`,
        },
      });
      codegenOptions.pluginMap['flowOperations'] = require('@graphql-codegen/flow-operations') as CodegenPlugin;
      codegenOptions.plugins.push({
        flowOperations: {
          ...DEFAULT_FLOW_CONFIG,
          // See https://github.com/cometkim/gatsby-plugin-typegen/issues/45
          exportFragmentSpreadSubTypes: true,
          typesPrefix: `${namespace}$`,
        },
      });
      if (includeResolvers) {
        codegenOptions.pluginMap['flowResolvers'] = require('@graphql-codegen/flow-resolvers') as CodegenPlugin;
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
        const FLOW_FILE_TOP = '/* @flow */\n\n';
        const FLOW_FILE_TOP_REGEXP = /\/\*\s*@flow\s*\*\/\s*/;
        result = result.replace(FLOW_FILE_TOP_REGEXP, FLOW_FILE_TOP + 'opaque type never = mixed;\n\n');

        const TYPEDEF_EXPORT_NODE_REGEXP = /export type ((.*)(\{\|?|;)($|\s))/g;
        result = result.replace(TYPEDEF_EXPORT_NODE_REGEXP, 'declare type $1');
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

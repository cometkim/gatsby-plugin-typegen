import { Reporter } from 'gatsby';
import { GraphQLSchema } from 'gatsby/graphql';
import { cargo, asyncify, AsyncCargo } from 'async';
import { codegen } from '@graphql-codegen/core';
import { Source } from '@graphql-toolkit/common';

import { delay, writeFile, formatLanguage } from '../common';

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
} as const;

const DEFAULT_TYPESCRIPT_CONFIG = {
  avoidOptionals: true,
  immutableTypes: true,
} as const;

const DEFAULT_FLOW_CONFIG = {
  useFlowExactObject: true,
  useFlowReadOnlyTypes: true,
} as const;

type CodegenTaskPayload = {
  documents: Source[],
};
type CodegenWorker = Omit<AsyncCargo, 'push'> & {
  push(task: CodegenTaskPayload, cb?: Function): void,
};
interface SetupCodegenWorkerFn {
  (props: {
    schemaAst: GraphQLSchema,
    reporter: Reporter,
    outputPath: string,
    language: 'typescript' | 'flow',
    includeResolvers: boolean,
  }): CodegenWorker;
}
export const setupCodegenWorker: SetupCodegenWorkerFn = ({
  schemaAst,
  outputPath,
  language,
  includeResolvers,
  reporter,
}) => {
  const worker = cargo(asyncify(async (tasks: CodegenTaskPayload[]) => {
    const { length: l, [l - 1]: last } = tasks;
    const { documents } = last;

    type CodegenOptions = Parameters<typeof codegen>[0];
    const codegenOptions: CodegenOptions  = {
      schema: undefined as any,
      schemaAst,
      documents: documents,
      filename: outputPath,
      config: DEFAULT_SHARED_CONFIG,
      plugins: [],
      pluginMap: {},
    };
    if (language === 'typescript') {
      codegenOptions.pluginMap['typescript'] = require('@graphql-codegen/typescript');
      codegenOptions.plugins.push({ typescript: DEFAULT_TYPESCRIPT_CONFIG });
      codegenOptions.pluginMap['typescriptOperations'] = require('@graphql-codegen/typescript-operations');
      codegenOptions.plugins.push({ typescriptOperations: DEFAULT_TYPESCRIPT_CONFIG });
      if (includeResolvers) {
        codegenOptions.plugins.push({ typescriptResolvers: {} });
        codegenOptions.pluginMap['typescriptResolvers'] = require('@graphql-codegen/typescript-resolvers');
      }
    } else /* flow */ {
      codegenOptions.pluginMap['flow'] = require('@graphql-codegen/flow');
      codegenOptions.plugins.push({ flow: DEFAULT_FLOW_CONFIG });
      codegenOptions.pluginMap['flowOperations'] = require('@graphql-codegen/flow-operations');
      codegenOptions.plugins.push({ flowOperations: DEFAULT_FLOW_CONFIG });
      if (includeResolvers) {
        codegenOptions.pluginMap['flowResolvers'] = require('@graphql-codegen/flow-resolvers');
        codegenOptions.plugins.push({ flowResolvers: {} });
      }
    }

    reporter.verbose(`[typegen] Generate type definitions to ${outputPath}. (language: ${formatLanguage(language)})`);

    const result = await codegen(codegenOptions);
    await writeFile(outputPath, result);

    return delay(CARGO_DELAY);
  }));

  return worker;
};

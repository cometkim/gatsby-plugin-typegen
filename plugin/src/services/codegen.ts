import { GraphQLSchema, DocumentNode } from 'gatsby/graphql';
import { codegen } from '@graphql-codegen/core';
import type { Types } from '@graphql-codegen/plugin-helpers';
import type { TypeScriptPluginConfig } from '@graphql-codegen/typescript/config';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations/config';
import type { TypeScriptResolversPluginConfig } from '@graphql-codegen/typescript-resolvers/config';
import type { FlowPluginConfig } from '@graphql-codegen/flow/config';
import type { FlowDocumentsPluginConfig } from '@graphql-codegen/flow-operations/config';
import type { RawResolversConfig } from '@graphql-codegen/visitor-plugin-common';

type FlowResolversPluginConfig = RawResolversConfig;

import type { Config } from '../internal/config';
import type { TypegenReporter } from '../internal/reporter';
import { formatLanguage } from '../internal/utils';

type Source = {
  document: DocumentNode,
  hash?: string,
};

interface CodegenService {
  (props: {
    schema: GraphQLSchema,
    documents: Source[],
  }): Promise<void>;
}

interface MakeCodegenService {
  (deps: {
    outputPath: Config['outputPath'],
    namespace: Config['namespace'],
    language: Config['language'],
    includeResolvers: Config['includeResolvers'],
    customScalars: Config['scalars'],
    reporter: TypegenReporter,
    writeFileContent: (path: string, content: string) => Promise<void>,
  }): CodegenService;
}

export { makeCodegenService };

// Preset configurations to ensure compatibility with Gatsby.
const DEFAULT_CONFIG = Object.freeze({
  namingConvention: {
    typeNames: 'keep',
    enumValues: 'keep',
    transformUnderscore: false,
  },
  addUnderscoreToArgsType: true,
  skipTypename: true,
  flattenGeneratedTypes: true,
});

const DEFAULT_TYPESCRIPT_SCALARS = Object.freeze({
  // A date string, such as 2007-12-03, compliant with the ISO 8601 standard for
  // representation of dates and times using the Gregorian calendar.
  Date: 'string',

  // The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
  // Note: This will never be used since this is reserved by GatsbyJS internal
  JSON: 'any',
});

const DEFAULT_TYPESCRIPT_CONFIG: Readonly<TypeScriptPluginConfig> = (
  Object.freeze({
    avoidOptionals: true,
    immutableTypes: true,
    // Will be changed from v4
    maybeValue: 'T | undefined',
    noExport: true,
    enumsAsTypes: true,
    scalars: DEFAULT_TYPESCRIPT_SCALARS,
    useTypeImports: true,
  })
);

const DEFAULT_TYPESCRIPT_OPERATIONS_CONFIG: Readonly<TypeScriptDocumentsPluginConfig> = (
  Object.freeze({
    ...DEFAULT_TYPESCRIPT_CONFIG,
    exportFragmentSpreadSubTypes: true,
  })
);

const DEFAULT_TYPESCRIPT_RESOLVERS_CONFIG: TypeScriptResolversPluginConfig = (
  Object.freeze({
    ...DEFAULT_TYPESCRIPT_CONFIG,
    contextType: 'gatsby-plugin-typegen/types#GatsbyResolverContext',
  })
);

const DEFAULT_FLOW_SCALARS = Object.freeze({
  // A date string, such as 2007-12-03, compliant with the ISO 8601 standard for
  // representation of dates and times using the Gregorian calendar.
  Date: 'string',

  // The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
  // Note: This will never be used since this is reserved by GatsbyJS internal
  JSON: 'any',
});

const DEFAULT_FLOW_CONFIG: Readonly<FlowPluginConfig> = (
  Object.freeze({
    useFlowExactObjects: true,
    useFlowReadOnlyTypes: true,
    scalars: DEFAULT_FLOW_SCALARS,
  })
);

const DEFAULT_FLOW_OPERATIONS_CONFIG: Readonly<FlowDocumentsPluginConfig> = (
  Object.freeze({
    ...DEFAULT_FLOW_CONFIG,
    exportFragmentSpreadSubTypes: true,
  })
);

const DEFAULT_FLOW_RESOLVERS_CONFIG: Readonly<FlowResolversPluginConfig> = (
  Object.freeze({
    ...DEFAULT_FLOW_CONFIG,
    contextType: 'gatsby-plugin-typegen/types.flow#type GatsbyResolverContext',
  })
);

const makeCodegenService: MakeCodegenService = ({
  outputPath,
  language,
  namespace,
  includeResolvers,
  customScalars,
  reporter,
  writeFileContent,
}) => {
  const pluginConfig: Pick<Types.GenerateOptions, 'plugins' | 'pluginMap'> = {
    pluginMap: {
      add: require('@graphql-codegen/add'),
    },
    plugins: [
      {
        add: {
          placement: 'prepend',
          content: '/* eslint-disable */\n',
        },
      },
    ],
  };

  switch (language) {
    case 'typescript': {
      pluginConfig.pluginMap = {
        ...pluginConfig.pluginMap,
        typescript: require('@graphql-codegen/typescript'),
        typescriptOperations: require('@graphql-codegen/typescript-operations'),
      };

      pluginConfig.plugins.push({
        add: {
          placement: 'prepend',
          content: `\ndeclare namespace ${namespace} {\n`,
        },
      });
      pluginConfig.plugins.push({
        typescript: DEFAULT_TYPESCRIPT_CONFIG,
      });
      pluginConfig.plugins.push({
        typescriptOperations: DEFAULT_TYPESCRIPT_OPERATIONS_CONFIG,
      });
      pluginConfig.plugins.push({
        add: {
          placement: 'append',
          content: '\n}\n',
        },
      });

      if (includeResolvers) {
        pluginConfig.pluginMap = {
          ...pluginConfig.pluginMap,
          typescriptResolvers: require('@graphql-codegen/typescript-resolvers'),
        };
        pluginConfig.plugins.push({
          typescriptResolvers: DEFAULT_TYPESCRIPT_RESOLVERS_CONFIG,
        });
      }

      break;
    }

    case 'flow': {
      pluginConfig.pluginMap = {
        ...pluginConfig.pluginMap,
        flow: require('@graphql-codegen/flow'),
        flowOperations: require('@graphql-codegen/flow-operations'),
      };

      pluginConfig.plugins.push({
        flow: {
          ...DEFAULT_FLOW_CONFIG,
          typesPrefix: `${namespace}$`,
        },
      });
      pluginConfig.plugins.push({
        flowOperations: {
          ...DEFAULT_FLOW_OPERATIONS_CONFIG,
          typesPrefix: `${namespace}$`,
        },
      });

      if (includeResolvers) {
        pluginConfig.pluginMap = {
          ...pluginConfig.pluginMap,
          flowResolvers: require('@graphql-codegen/flow-resolvers'),
        };
        pluginConfig.plugins.push({
          flowResolvers: {
            ...DEFAULT_FLOW_RESOLVERS_CONFIG,
            typesPrefix: `${namespace}$`,
          },
        });
      }

      break;
    }
  }

  return async ({
    schema,
    documents,
  }) => {
    const codegenOptions: Omit<Types.GenerateOptions, 'plugins' | 'pluginMap'> = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore for inaccurate type definitions
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      schema: undefined as any,
      schemaAst: schema,
      documents,
      filename: outputPath,
      config: {
        ...DEFAULT_CONFIG,
        scalars: customScalars,
      },
    };

    reporter.verbose(`Generate type definitions to ${outputPath}. (language: ${formatLanguage(language)})`);

    let result = await codegen({
      ...pluginConfig,
      ...codegenOptions,
    });

    // FIXME: find more accurate way
    if (language === 'flow') {
      const FLOW_FILE_TOP = '/* @flow */\n\n';
      const FLOW_FILE_TOP_REGEXP = /\/\*\s*@flow\s*\*\/\s*/;
      result = result.replace(FLOW_FILE_TOP_REGEXP, FLOW_FILE_TOP + 'opaque type never = mixed;\n\n');

      const TYPEDEF_EXPORT_NODE_REGEXP = /export type ((.*)(\{\|?|;)($|\s))/g;
      result = result.replace(TYPEDEF_EXPORT_NODE_REGEXP, 'declare type $1');
    }

    await writeFileContent(outputPath, result);
  };
};

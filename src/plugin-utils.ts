import path from 'path';
import { Required } from 'utility-types';
import { Store, Reporter } from 'gatsby';

import { PluginOptions, DeprecatedPluginOptions, SchemaOutputOptions } from './types';
import { formatLanguage } from './common';

// No parsing by default, save introspection result file as json format.
const DEFAULT_SCHEMA_OUTPUT_OPTION = {
  format: 'introspection',
  commentDescriptions: true,
} as const;

type MapTrueToDefault<T> = T extends { [key: string]: infer V }
  ? V extends true
  ? { [key: string]: typeof DEFAULT_SCHEMA_OUTPUT_OPTION }
  : { [key: string]: SchemaOutputOptions }
  : never;

export type RequiredPluginOptions = Required<
  Omit<
    PluginOptions,
    keyof DeprecatedPluginOptions | 'emitSchema'
  > & {
    emitSchema: MapTrueToDefault<PluginOptions['emitSchema']>
  }
>;

interface RequirePluginOptionsFn {
  (
    options: unknown,
    props: {
      reporter: Reporter,
      store: Store,
    },
  ): RequiredPluginOptions;
}
export const requirePluginOptions: RequirePluginOptionsFn = (
  options,
  {
    store,
    reporter,
  },
) => {
  const { program } = store.getState();
  const basePath = program.directory as string;

  // There are no required properties (yet), so must be compatible.
  const pluginOptions = options as PluginOptions;

  const {
    language = 'typescript',
    includeResolvers = false,
    autoFix = true,
    emitSchema: emitSchemaOptionMap = {},
    emitPluginDocuments = {},
    schemaOutputPath,
    typeDefsOutputPath,
  } = pluginOptions;

  const emitSchema: MapTrueToDefault<typeof emitSchemaOptionMap> = {};
  for (const [key, options] of Object.entries(emitSchemaOptionMap)) {
    emitSchema[key] = options === true ? DEFAULT_SCHEMA_OUTPUT_OPTION : options;
  }

  if (schemaOutputPath) {
    reporter.warn('`schemaOutputPath` was deprecated, please use `emitSchema` instead.')
    emitSchema[schemaOutputPath] = DEFAULT_SCHEMA_OUTPUT_OPTION;
  }

  if (typeDefsOutputPath) {
    reporter.warn('`typeDefsOutputPath` was deprecated, please use `outputPath` instead.');
  }

  const outputPath = pluginOptions.outputPath || typeDefsOutputPath || (
    language === 'typescript'
    ? path.resolve(basePath, 'src/__generated__/gatsby-types.ts')
    : path.resolve(basePath, 'src/__generated__/gatsby-types.js')
  );

  if ((language === 'typescript') !== (outputPath.endsWith('ts'))) {
    reporter.warn(
      reporter.stripIndent(
      `The language you specified is not match to file extension.
        - language: ${formatLanguage(language)}
        - outputPath: ${outputPath}
      `),
    );
  }

  return {
    language,
    outputPath,
    includeResolvers,
    autoFix,
    emitSchema,
    emitPluginDocuments,
  };
};

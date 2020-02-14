import path from 'path';
import { Required } from 'utility-types';
import { Store, Reporter } from 'gatsby';
import checkHasYarn from 'has-yarn';

import { PluginOptions, DeprecatedPluginOptions } from './types';
import { formatLanguage } from './common';

export type RequiredPluginOptions = Required<Omit<PluginOptions, keyof DeprecatedPluginOptions>>;

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
  const hasYarn = checkHasYarn();

  const { program } = store.getState();
  const basePath = program.directory as string;

  // There are no required properties (yet), so must be compatible.
  const pluginOptions = options as PluginOptions;

  const {
    language = 'typescript',
    includeResolvers = false,
    quiet = false,
    autoFix = true,
    emitSchema = {},
    ignorePatterns: extraIgnorePatterns = [],
    schemaOutputPath,
    typeDefsOutputPath,
  } = pluginOptions;

  if (schemaOutputPath) {
    reporter.warn('`schemaOutputPath` was deprecated, please use `emitSchema` instead.')
    emitSchema[schemaOutputPath] = {
      format: 'json',
    };
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

  const ignorePatterns = [
    // Do not watch generated file
    outputPath,

    // Do not watch dts files
    '**/*.d.ts',

    // Do not watch emitted schema files
    ...Object.keys(emitSchema),

    // Do not watch files black-listed by gatsby-config
    ...extraIgnorePatterns,
  ];

  // Add future validation & conversion here.

  return {
    language,
    outputPath,
    includeResolvers,
    quiet,
    ignorePatterns,
    autoFix,
    emitSchema,
  };
};

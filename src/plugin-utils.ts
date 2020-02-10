import { Required } from 'utility-types';
import { Reporter } from 'gatsby';

import { PluginOptions, DeprecatedPluginOptions } from './types';

interface RequirePluginOptionsFn {
  (
    options: unknown,
    props: {
      reporter: Reporter,
    },
  ): Required<Omit<PluginOptions, keyof DeprecatedPluginOptions>>;
}

export const requirePluginOptions: RequirePluginOptionsFn = (
  options,
  { reporter },
) => {
  // There are no required properties (yet), so must be compatible.
  const pluginOptions = options as PluginOptions;

  const {
    language = 'typescript',
    useResolvers = false,
    quiet = false,
    autoFix = true,
    emitSchema = {},
    ignorePatterns: extraIgnorePatterns,
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
    ? 'src/__generated__/gatsby-types.ts'
    : 'src/__generated__/gatsby-types.js'
  );

  if ((language === 'typescript') !== (outputPath.endsWith('ts'))) {
    reporter.warn(`The language you specified is not match to file extension.
language: ${language}
outputPath: ${outputPath}
`);
  }

  const ignorePatterns = [
    // Do not watch generated file
    outputPath,

    // Do not watch emitted schema files
    ...Object.keys(emitSchema),

    // Do not watch files black-listed by gatsby-config
    ...extraIgnorePatterns,
  ];

  // Add future validation & conversion here.

  return {
    language,
    outputPath,
    useResolvers,
    quiet,
    ignorePatterns,
    autoFix,
    emitSchema,
  };
};

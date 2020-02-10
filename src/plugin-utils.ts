import { Required } from 'utility-types';
import { Reporter } from 'gatsby';
import checkHasYarn from 'has-yarn';

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
  const hasYarn = checkHasYarn();

  // There are no required properties (yet), so must be compatible.
  const pluginOptions = options as PluginOptions;

  const {
    language = 'typescript',
    includeResolvers = false,
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

  if (includeResolvers && language === 'typescript') {
    try {
      require('@graphql-codegen/typescript-resolvers');
    } catch (err) {
      reporter.panic(
        'You set `includeResolvers: true`, but could not found required plugin. \nRun '
        + hasYarn
          ? '`yarn add @graphql-codegen/typescript-resolvers`'
          : '`npm install --save @graphql-codegen/typescript-resolvers`'
        + ' and try again.'
        , err);
    }
  }
  if (includeResolvers && language === 'flow') {
    try {
      require('@graphql-codegen/flow-resolvers');
    } catch (err) {
      reporter.panic(
        'You set `includeResolvers: true`, but could not found required plugin. \nRun '
        + hasYarn
          ? '`yarn add @graphql-codegen/flow-resolvers`'
          : '`npm install --save @graphql-codegen/flow-resolvers`'
        + ' and try again.'
        , err);
    }
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
    includeResolvers,
    quiet,
    ignorePatterns,
    autoFix,
    emitSchema,
  };
};

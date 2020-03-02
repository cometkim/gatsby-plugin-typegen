import path from 'path';
import { Required } from 'utility-types';
import { Store, Reporter } from 'gatsby';

import {
  PluginOptions,
  LanguageOptions,
  SchemaOutputOptions,
  DeprecatedPluginOptions,
} from './types';
import { formatLanguage } from './common';

// No parsing by default, save introspection result file as json format.
const DEFAULT_SCHEMA_OUTPUT_OPTION = {
  format: 'introspection',
  commentDescriptions: true,
} as const;

type MapEmitSchemaOption<T> = T extends { [key: string]: infer V }
  ? V extends true
  ? { [key: string]: typeof DEFAULT_SCHEMA_OUTPUT_OPTION }
  : { [key: string]: SchemaOutputOptions }
  : never;

const DEFAULT_LANGUAGE_OPTION = {
  kind: 'type',
  scope: 'module',
  prefix: '',
} as const;

type MapLanguageOption<T> = T extends infer TOption
  ? TOption extends 'typescript'
  ? { language: 'typescript' } & typeof DEFAULT_LANGUAGE_OPTION
  : TOption extends 'flow'
  ? { language: 'flow' } & typeof DEFAULT_LANGUAGE_OPTION
  : Required<LanguageOptions>
  : never;

export type RequiredPluginOptions = Required<
  Omit<
    PluginOptions,
    (
      | keyof DeprecatedPluginOptions
      | 'language'
      | 'emitSchema'
    )
  > & {
    languageOption: MapLanguageOption<PluginOptions['language']>
    emitSchema: MapEmitSchemaOption<PluginOptions['emitSchema']>
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
    emitSchema: emitSchemaOptionMap = {},
    includeResolvers = false,
    autoFix = true,
    emitPluginDocuments = {},
    schemaOutputPath,
    typeDefsOutputPath,
  } = pluginOptions;

  const languageOption: MapLanguageOption<typeof language> =
    typeof language === 'string' ? { language, ...DEFAULT_LANGUAGE_OPTION }
    : {
      language: language.language ?? 'typescript',
      kind: language.kind ?? 'type',
      scope: language.scope ?? 'module',
      prefix: language.prefix ?? '',
      ...language.scope === 'namespace' && {
        namespace: language.namespace ?? 'GatsbyTypes',
      },
    };

  const emitSchema: MapEmitSchemaOption<typeof emitSchemaOptionMap> = {};
  for (const [key, options] of Object.entries(emitSchemaOptionMap)) {
    if (options === true) {
      emitSchema[key] = {
        ...DEFAULT_SCHEMA_OUTPUT_OPTION,
        // Infer format option based on filename.
        format: /\.(gql|graphql)$/.test(key)
          ? 'sdl'
          : 'introspection',
      };
    }
  }

  if (schemaOutputPath) {
    reporter.warn('`schemaOutputPath` was deprecated, please use `emitSchema` instead.')
    emitSchema[schemaOutputPath] = DEFAULT_SCHEMA_OUTPUT_OPTION;
  }

  if (typeDefsOutputPath) {
    reporter.warn('`typeDefsOutputPath` was deprecated, please use `outputPath` instead.');
  }

  const outputPath = pluginOptions.outputPath || typeDefsOutputPath || (
    languageOption.language === 'typescript'
    ? path.resolve(basePath, 'src/__generated__/gatsby-types.ts')
    : path.resolve(basePath, 'src/__generated__/gatsby-types.js')
  );

  if ((languageOption.language === 'typescript') !== /\.tsx?$/.test(outputPath)) {
    reporter.warn(
      reporter.stripIndent(
      `The language you specified is not match to file extension.
        - language: ${formatLanguage(languageOption.language)}
        - outputPath: ${outputPath}
      `),
    );
  }

  if (languageOption.scope === 'global' && !languageOption.prefix) {
    // FIXME: 영작
    reporter.panicOnBuild('...');
  }

  if (languageOption.scope !== 'module' && !outputPath.endsWith('.d.ts')) {
    // FIXME: 영작
    reporter.warn('...')
  }

  return {
    languageOption,
    outputPath,
    includeResolvers,
    autoFix,
    emitSchema,
    emitPluginDocuments,
  };
};

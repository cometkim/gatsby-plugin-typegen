import * as path from 'path';

import { gatsbyInternalScalars } from '../gatsby-utils';

import type {
  PluginOptions,
  SchemaOutputOptions,
  DocumentOutputOptions,
} from './options';
import type { OverrideProps } from './utils';
import { formatLanguage } from './utils';
import type { TypegenReporter } from './reporter';

const defaultSchemaOutputOption = Object.freeze({
  format: 'introspection',
  commentDescriptions: true,
  omitPluginMetadata: true,
} as const);

type MapSchemaOutputOption<T> = T extends { [key: string]: infer V }
  ? V extends true
  ? { [key: string]: typeof defaultSchemaOutputOption }
  : { [key: string]: Required<SchemaOutputOptions> }
  : never;

const defaultDocumentOutputOption = Object.freeze({
  format: 'graphql',
} as const);

type MapDocumentOutputOption<T> = T extends { [key: string]: infer V }
  ? V extends true
  ? { [key: string]: typeof defaultDocumentOutputOption }
  : { [key: string]: Required<DocumentOutputOptions> }
  : never;

export type Config = Required<
  OverrideProps<
    PluginOptions, {
      emitSchema: MapSchemaOutputOption<PluginOptions['emitSchema']>,
      emitPluginDocuments: MapDocumentOutputOption<PluginOptions['emitPluginDocuments']>,
    }
  >
>;

interface ValidateConfig {
  (
    props: {
      options: PluginOptions,
      basePath: string,
      reporter: TypegenReporter,
    },
  ): Readonly<Config>;
}
export const validateConfig: ValidateConfig = ({
  options,
  basePath,
  reporter,
}) => {
  // There are no required properties (yet), so must be compatible.
  const pluginOptions = options;

  const {
    language = 'typescript',
    namespace = 'GatsbyTypes',
    includeResolvers = false,
    autoFix = true,
    emitSchema: emitSchemaOptionMap = {},
    emitPluginDocuments: emitPluginDocumentsOptionMap = {},
    scalars = {},
  } = pluginOptions;

  if (includeResolvers) {
    reporter.warn('The `includeResolvers` option is deprecated. It will be removed in v4');
  }

  const emitSchema: MapSchemaOutputOption<typeof emitSchemaOptionMap> = {};
  for (const [key, options] of Object.entries(emitSchemaOptionMap)) {
    if (!options) continue;
    if (options === true) {
      emitSchema[key] = {
        ...defaultSchemaOutputOption,
        // Infer format option based on filename.
        format: /\.(graphql|graphqls|gql)$/.test(key)
          ? 'sdl'
          : 'introspection',
      };
    } else {
      emitSchema[key] = {
        ...defaultSchemaOutputOption,
        ...options,
      };
    }
  }

  const emitPluginDocuments: MapDocumentOutputOption<typeof emitPluginDocumentsOptionMap> = {};
  for (const [key, options] of Object.entries(emitPluginDocumentsOptionMap)) {
    if (!options) continue;
    if (options === true) {
      emitPluginDocuments[key] = {
        ...defaultDocumentOutputOption,
        // Infer format option based on filename.
        format: /\.json$/.test(key)
          ? 'json'
          : 'graphql',
      };
    } else {
      emitPluginDocuments[key] = {
        ...defaultDocumentOutputOption,
        ...options,
      };
    }
  }

  const outputPath = pluginOptions.outputPath || (
    language === 'typescript'
    ? path.resolve(basePath, 'src/__generated__/gatsby-types.d.ts')
    : path.resolve(basePath, 'src/__generated__/gatsby-types.js.flow')
  );

  if ((language === 'typescript') !== /\.tsx?$/.test(outputPath)) {
    reporter.warn(
      reporter.stripIndent`
        The language you specified is not match to file extension.
          - language: ${formatLanguage(language)}
          - outputPath: ${outputPath}
      `,
    );
  }

  for (const type of gatsbyInternalScalars) {
    if (scalars[type]) {
      reporter.warn(
        `You couldn't override type for \`${type}\` scalar because it is reserved by Gatsby internal.`,
      );
      delete scalars[type];
    }
  }

  return Object.freeze({
    language,
    namespace,
    outputPath,
    includeResolvers,
    autoFix,
    emitSchema,
    emitPluginDocuments,
    scalars,
  });
};

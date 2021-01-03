import * as path from 'path';

import type {
  PluginOptions,
  SchemaOutputOptions,
  DocumentOutputOptions,
} from './pluginOptions';
import type { TypegenReporter } from './reporter';
import type { OverrideProps } from './utils';
import { formatLanguage, gatsbyInternalScalars } from './utils';

const defaultSchemaOutputOption = Object.freeze({
  format: 'introspection',
  commentDescriptions: true,
  omitPluginMetadata: true,
} as const);

const defaultDocumentOutputOption = Object.freeze({
  format: 'graphql',
} as const);

type EmitSchemaConfig = {
  [filePath: string]: Required<SchemaOutputOptions>,
};

type EmitPluginDocumentConfig = {
  [filePath: string]: Required<DocumentOutputOptions>,
};

export type Config = OverrideProps<
  Required<PluginOptions>, {
    emitSchema: EmitSchemaConfig,
    emitPluginDocument: EmitPluginDocumentConfig,

    // deprecated options
    autoFix?: void,
    emitPluginDocuments?: void,
  }
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
    autoFix,
    autofix,
    emitSchema: emitSchemaOptionMap = {},
    emitPluginDocuments: legacyEmitPluginDocumentsOptionMap = {},
    emitPluginDocument: emitPluginDocumentsOptionMap = {},
    scalars = {},
  } = pluginOptions;

  if (autoFix != null) {
    reporter.warn('The `autoFix` option is deprecated. Use `autofix` instead.');
  }

  if (includeResolvers) {
    reporter.warn('The `includeResolvers` option is deprecated. It will be removed in v4');
  }

  const emitSchema: EmitSchemaConfig = {};
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

  const emitPluginDocument: EmitPluginDocumentConfig = {};

  // TBD: remove next major release
  for (const [key, options] of Object.entries(legacyEmitPluginDocumentsOptionMap)) {
    if (!options) continue;
    if (options === true) {
      emitPluginDocument[key] = {
        ...defaultDocumentOutputOption,
        format: /\.json$/.test(key)
          ? 'json'
          : 'graphql',
      };
    } else {
      emitPluginDocument[key] = {
        ...defaultDocumentOutputOption,
        ...options,
      };
    }
  }
  for (const [key, options] of Object.entries(emitPluginDocumentsOptionMap)) {
    if (!options) continue;
    if (options === true) {
      emitPluginDocument[key] = {
        ...defaultDocumentOutputOption,
        // Infer format option based on filename.
        format: /\.json$/.test(key)
          ? 'json'
          : 'graphql',
      };
    } else {
      emitPluginDocument[key] = {
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
    autofix: (autofix === true) || (autoFix === true) || (autofix !== false),
    emitSchema,
    emitPluginDocument,
    scalars,
  });
};

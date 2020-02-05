import { GraphQLResolveInfo, GraphQLOutputType } from 'graphql';

export type PluginOptions = {

  /**
   * Prefer TypeScript by default, but you can switch to flow.
   *
   * @default 'typesciprt'
   */
  language?: 'typescript' | 'flow',

  /**
   * Path to save generated typeDefs file.
   *
   * Strongly recommend to commit this file to your version control.
   *
   * @default 'src/__generated__/gatsby-types.ts'
   *
   * or (if you use flow)
   * @default 'src/__generated__/gatsby-types.js'
   */
  outputPath?: string,

  /**
   * If you use [schema customization](https://www.gatsbyjs.org/docs/schema-customization/),
   * you might want types for custom resolvers.
   *
   * By default, the plugin only generate types for query data for your components.
   *
   * If set this true, the plugin also generate types for all possible resolver signatures.
   *
   * @default false
   *
   * @see https://graphql-code-generator.com/docs/plugins/typescript-resolvers
   * @see https://graphql-code-generator.com/docs/plugins/flow-resolvers
   */
  useResolvers?: boolean,


  /**
   * If set this true, plugin will print no logs except panic.
   *
   * @default false
   */
  quiet?: boolean,

  /**
   *
   */
  ignorePatterns?: string[],

  /**
   * Enable auto-fixing `useStaticQuery()` & `<StaticQuery>` with generated type names.
   *
   * @default true
   */
  autoFix?: boolean,


  /**
   * Emit the extracted Gatsby's schema definition into the filesystem.
   *
   * @default {} // does not emit schema file by default.
   */
  emitSchema?: {
    [outputPath: string]: SchemaOutputOptions,
  },
} & DeprecatedPluginOptions;

type SchemaOutputOptions = {
  format: 'json' | 'graphql',
};

export type DeprecatedPluginOptions = {
  /**
   * Path to where the schema file is being generated.
   *
   * @deprecated
   *
   * @default `${CWD}/.cache/caches/gatsby-plugin-typegen/schema.json`
   */
  schemaOutputPath?: string,

  /**
   * Path to where the type definition file is being generated.
   *
   * @deprecated
   *
   * @default `${CWD}/node_modules/generated/types/gatsby.ts`
   */
  typeDefsOutputPath?: string,
};

/**
 * Type definition for https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby/src/schema/context.js
 *
 * @todo Provide correct type definition.
 */
export type GatsbyResolverContext = {
  defaultFieldResolvers: any,
  nodeModel: any,
};

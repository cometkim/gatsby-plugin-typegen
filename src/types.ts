import { GraphQLResolveInfo, GraphQLOutputType, IntrospectionOptions, BuildSchemaOptions } from 'gatsby/graphql';

export type PluginOptions = {

  /**
   * Prefer TypeScript by default, but you can switch to flow.
   *
   * @default 'typescript'
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
  includeResolvers?: boolean,

  /**
   * Enable auto-fixing `useStaticQuery()` & `<StaticQuery>` with generated type names.
   *
   * @default true
   */
  autoFix?: boolean,


  /**
   * Emit the Gatsby's schema into the filesystem.
   *
   * Set value as `true` and use default options.
   *
   * @see SchemaOutputOptions
   */
  emitSchema?: {
    [outputPath: string]: true | SchemaOutputOptions,
  },
} & DeprecatedPluginOptions;

export type SchemaOutputOptions = {
  /**
   * Output file format.
   *
   * By default, the introspection result is emitted as JSON.
   * If set `sdl`, introspection will be parsed and printed to GraphQL SDL.
   *
   * @default 'introspection'
   */
  format: 'introspection' | 'sdl',

  /**
   * Include comment descriptions
   *
   * @default true
   */
  commentDescriptions?: boolean,
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

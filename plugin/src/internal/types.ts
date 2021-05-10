export type PluginOptions = {

  /**
   * Prefer TypeScript by default, but you can switch to flow.
   *
   * @default 'typescript'
   */
  language?: 'typescript' | 'flow',

  /**
   * Namespace is required to avoid conflict on generated types and other global declarations.
   *
   * Flow will use $ prefix as fallback.
   * e.g) `type GatsbyTypes$MySiteQuery = ...`
   *
   * @default 'GatsbyTypes'
   */
  namespace?: string,

  /**
   * Path to save generated typeDefs file.
   *
   * Strongly recommend to commit this file to your version control.
   *
   * @default 'src/__generated__/gatsby-types.d.ts'
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
   * Extends or overrides the built-in scalars and custom GraphQL scalars to a custom type.
   *
   * @example
   * ```js
   * {
   *   scalars: {
   *     EmailAddress: 'string',
   *     DateTime: 'number',
   *     URL: 'string',
   *   },
   * }
   * ```
   *
   * @note You cannot override a few GraphQL/GatsbyJS internal scalars.
   * - `Boolean`,
   * - `Buffer`,
   * - `Date`,
   * - `Float`,
   * - `ID`,
   * - `Int`,
   * - `Internal`,
   * - `InternalInput`,
   * - `JSON`,
   * - `Json`,
   * - `Node`,
   * - `NodeInput`,
   * - `Query`,
   * - `String`,
   *
   * @see https://github.com/gatsbyjs/gatsby/blob/6b4b7f81ec/packages/gatsby/src/schema/print.js#L33-L48
   */
  scalars?: { [typename: string]: string },


  /**
   * Emit the Gatsby's schema into the filesystem.
   *
   * Set value as `true` and use default options.
   *
   * @see SchemaOutputOptions
   */
  emitSchema?: {
    [outputPath: string]: boolean | SchemaOutputOptions,
  },

  /**
   * Emit the GraphQL fragments declared by other plugins into the filesystem.
   */
  emitPluginDocuments?: {
    [outputPath: string]: boolean | DocumentOutputOptions,
  },
};

export type DocumentOutputOptions = {
  /**
   * Output file format.
   *
   * By default, the AST will be parsed and printed as GraphQL.
   * If set `json`, the AST will be emitted as JSON.
   *
   * @default 'graphql'
   */
  format: 'graphql' | 'json',
};

export type SchemaOutputOptions = {
  /**
   * Output file format.
   *
   * By default, the introspeciton result will be emitted as JSON
   * If set `sdl`, the AST will be parsed and printed, aka GraphQL SDL.
   *
   * @default 'graphql'
   */
  format: 'introspection' | 'sdl',

  /**
  * Include comment descriptions
  *
  * @default true
  */
  commentDescriptions?: boolean,
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

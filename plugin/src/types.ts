export type { PluginOptions } from './internal/pluginOptions';

/**
 * Copy of the `IGatsbyResolverContext`
 * @see https://github.com/gatsbyjs/gatsby/blob/f10eb58/packages/gatsby/src/schema/type-definitions.ts
 *
 * @todo Provide more accurate type definition.
 */
export interface GatsbyResolverContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodeModel: any;
}

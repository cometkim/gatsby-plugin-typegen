export type PluginOptions = {
  /**
   * Path to where the schema file is being generated.
   * @default `${CWD}/.cache/caches/gatsby-plugin-typegen/schema.json`
   */
  schemaOutputPath?: string,

  /**
   * Path to where the type definition file is being generated.
   * @default `${CWD}/node_modules/generated/types/gatsby.ts`
   */
  typeDefsOutputPath?: string,
};

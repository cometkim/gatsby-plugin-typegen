# gatsby-plugin-typegen

Watch changes, Automatically generates TypeScript definitions.

- [x] Schema extraction
- [x] Generates code using graphql-codegen
- [x] Options to customize paths
- [x] Auto-fixing `<StaticQuery>` and `useStaticQuery()` with generated type name.

![Demonstration auto-fixing](recording-20190909.gif)

## Requirements

- Node v10.0.0 +
- GatsbyJS v2 +

## Install

```bash
yarn add gatsby-plugin-typegen

# or
# npm install --save gatsby-plugin-typegen
```

## How to use

```js
// In your gatsby-config.js
plugins: [`gatsby-plugin-typegen`]
```

Also you can customize output path of generated files.

```ts
// Example of type-safe usage (optional)
import { PluginOptions as TypegenPluginOptions } from 'gatsby-plugin-typegen';

type Plugin = (
  | string
  | { resolve: string, options: any }
  | { resolve: `gatsby-plugin-typegen` options: TypegenPluginOptions }
);

const plugins: Plugin[] = {
  resolve: `gatsby-plugin-typegen`,
  options: {
    schemaOutputPath: `${__dirname}/.cache/caches/gatsby-plugin-typegen/schema.json`,
    typeDefsOutputPath: `${__dirname}/node_modules/generated/types/gatsby.ts`,
  },
};

module.exports = {
  plugins,
};
```

## Available options

- `schemaOutputPath`: (`string?`) Path to where the schema file is being generated.

- `typeDefsOutputPath`: (`string?`) Path to where the type definition file is being generated.

- `autoFix`: (`boolean?`) Enable auto-fixing static queries with generated types.

## Acknowledgements

- [gatsby-plugin-extract-code](https://github.com/NickyMeuleman/gatsby-plugin-extract-schema)
- [graphql-code-generator](https://graphql-code-generator.com/)

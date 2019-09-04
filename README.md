# gatsby-plugin-typegen

Watch changes, Automatically generates TypeScript definitions.

- [x] Schema extraction
- [x] Generates code using graphql-codegen
- [ ] Options to customize inputs/outputs (More plugins, Schema-JSON/SDL output option, Type definitions, etc)
- [ ] Auto-fixing codes using `<StaticQuery>` and `useStaticQuery()` with generated type parameters.

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

## Available options

TODO

## Acknowledgements

- [gatsby-plugin-extract-code](https://github.com/NickyMeuleman/gatsby-plugin-extract-schema)
- [graphql-code-generator](https://graphql-code-generator.com/)

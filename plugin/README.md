# gatsby-plugin-typegen
[![Package version](https://img.shields.io/npm/v/gatsby-plugin-typegen)](https://www.npmjs.com/package/gatsby-plugin-typegen)
[![Npm downloads](https://img.shields.io/npm/dw/gatsby-plugin-typegen)](https://www.npmjs.com/package/gatsby-plugin-typegen)
[![Integration](https://github.com/cometkim/gatsby-plugin-typegen/actions/workflows/ci.yml/badge.svg)](https://github.com/cometkim/gatsby-plugin-typegen/actions/workflows/ci.yml)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/cometkim/gatsby-plugin-typegen.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/cometkim/gatsby-plugin-typegen/context:javascript)
![License](https://img.shields.io/github/license/cometkim/gatsby-plugin-typegen)
[![Backers](https://opencollective.com/gatsby-plugin-typegen/tiers/backer/badge.svg?label=backer&color=brightgreen)](https://opencollective.com/gatsby-plugin-typegen)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-14-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

TypeScript/Flow code generation for GatsbyJS queries.

## Features

- Schema extraction
- Plugin documents extraction
- Generates type definitions for TypeScript & Flow, using [graphql-codegen](https://graphql-code-generator.com/)
- Auto-fixing `<StaticQuery>` and `useStaticQuery()` in code with generated type name.
- Integrates GatsbyJS project with GraphQL & TypeScript ecosystem.

However, GatsbyJS provides [builtin typegen feature](https://www.gatsbyjs.com/docs/how-to/local-development/graphql-typegen/) since v4.15+. See [discussion](https://github.com/gatsbyjs/gatsby/discussions/35420).

**I strongly recommend to use the official feature instead of this plugin.** If you would like to experiment with other typegen use cases with this plugin, please [leave your idea](https://github.com/cometkim/gatsby-plugin-typegen/issues/174)!

## Demo

![Demonstration of auto-fixing](https://github.com/cometkim/gatsby-plugin-typegen/raw/main/plugin/images/auto-fixing-demo.gif)

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

### Example of type-safe usage

```ts
import type { PluginOptions as TypegenPluginOptions } from 'gatsby-plugin-typegen/types';

type Plugin = (
  | string
  | { resolve: string, options: object }
  | { resolve: `gatsby-plugin-typegen`, options: TypegenPluginOptions }
);

const plugins: Plugin[] = [
  {
    resolve: `gatsby-plugin-typegen`,
    options: {
      // ... customize options here
    },
  },
];

module.exports = {
  plugins,
};
```

### Change the output path

```js
{
  options: {
    outputPath: `src/__generated__/gatsby-types.d.ts`,
  },
}
```

### Switch to Flow

```js
{
  options: {
    language: `flow`,
    outputPath: `src/__generated__/gatsby-types.js.flow`,
  },
}
```

Add generated typedefs to `.flowconfig`:

```flowconfig
[lib]
./node_modules/gatsby-plugin-typegen/types.js.flow
./src/__generated__/gatsby-types.js.flow
```

### Emit schema as GraphQL SDL

```js
{
  options: {
    emitSchema: {
      'src/__generated__/gatsby-schema.graphql': true,
    },
  },
}
```

![GatsbyJS schema visualized](https://github.com/cometkim/gatsby-plugin-typegen/blob/main/plugin/images/gatsby-schema-visualized.png)

Visualized via [GraphQL Voyager](https://apis.guru/graphql-voyager/).

### VSCode extension

You can use the [VSCode GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) with a [graphql-config](https://graphql-config.com/introduction) file.

1. Install the [VSCode GraphQL extension](**https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql**).

2. Configure plugin to emit schema and plugin documents.

    ```js
    // gatsby-config.js

    module.exports = {
      plugins: [
        // ...
        {
          resolve: `gatsby-plugin-typegen`,
          options: {
            emitSchema: {
              'src/__generated__/gatsby-introspection.json': true,
            },
            emitPluginDocument: {
              'src/__generated__/gatsby-plugin-documents.graphql': true,
            },
          },
        },
      ],
    };
    ```

3. Create `graphql.config.js` file in project root or supported [graphql-configs](https://graphql-config.com/usage#config-search-places).

    ```js
    // graphql.config.js

    module.exports = {
      schema: ["src/__generated__/gatsby-introspection.json"],
      documents: ["src/__generated__/gatsby-plugin-documents.graphql"],
      extensions: {
        endpoints: {
          default: {
            url: "http://localhost:8000/___graphql",
            headers: { "user-agent": "JS GraphQL" },
            introspect: false,
          },
        },
      },
    }
    ```

4. Reload VSCode, `gatsby develop` to make queries in VSCode.
  ![VSCode extension preview](https://github.com/cometkim/gatsby-plugin-typegen/raw/main/plugin/images/vscode-graphql-extension-preview.gif)

### ESLint

You can use the extracted schema file for [eslint-plugin-graphql](https://github.com/apollographql/eslint-plugin-graphql)!

```js
// gatsby-config.js

module.exports = {
  plugins: [
    // ...
    {
      resolve: `gatsby-plugin-typegen`,
      options: {
        emitSchema: {
          'src/__generated__/gatsby-introspection.json': true,
        },
      },
    },
  ],
};
```

```js
// .eslintrc.js

const path = require('path');

module.exports = {
  plugins: [
    'graphql'
  ],
  rules: {
    'graphql/template-strings': ['error', {
      env: 'relay',
      tagName: 'graphql',
      schemaJsonFilepath: path.resolve(__dirname, 'src/__generated__/gatsby-introspection.json'),
    }],
  },
};
```

### TypeScript plugin

The extracted schema file can also be used for [ts-graphql-plugin](https://github.com/Quramy/ts-graphql-plugin). Using the config defined in [Emit schema as GraphQL SDL](#emit-schema-as-graphql-sdl):

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "plugins": [
      {
        "name": "ts-graphql-plugin",
        "schema": "src/__generated__/gatsby-schema.graphql",
        "tag": "graphql"
      }
    ]
  },
}
```

![demo with ts-graphql-plugin, it shows type hints, auto suggestions, type errors on GraphQL tag](https://github.com/cometkim/gatsby-plugin-typegen/raw/main/plugin/images/ts-graphql-plugin-demo.gif)

## Available options

Checkout the full documentation of plugin options from [`src/types.ts`](https://github.com/cometkim/gatsby-plugin-typegen/blob/main/plugin/src/types.ts).

## Disclaimer

This plugin is a bit opinionated about how integrate GatsbyJS and GCG. You cannot customize plugins and its options because this plugin is built for **ONLY GatsbyJS queries**.

If you wanna use codegen with other plugins (e.g. React Apollo), you can use [`@graphql-codegen/cli`](https://www.npmjs.com/package/@graphql-codegen/cli) for it.

## Changelog

### v3.0.0

- Added support for `GatsbyImageData` scalar. (See [gatsbyjs/gatsby#35683](https://github.com/gatsbyjs/gatsby/pull/35683))
- **[BREAKING CHANGE]** nullable fields are typed as `T | null`, instead of `T | undefined` (which was inaccurate).
- **The output is now stable**, no more dev-only fields, no more randomly-sorted definitions.
- `autoFix` option is renamed to `autofix`. Previous option will be removed in v4.
- `emitPluginDocuments` option is renamed to `emitPluginDocument`. Previous option will be removed in v4.
- Fixed bunch of bugs ([#138](https://github.com/cometkim/gatsby-plugin-typegen/pull/138)).
- Introduced a very predictable & debuggable scheduler built on top of [XState](https://xstate.js.org/).

### v2.2.4

- Fix misconfigured codegen options ([#$81](https://github.com/cometkim/gatsby-plugin-typegen/issues/81))

### v2.2.3

- Allow React v17 as peer dependency ([#140](https://github.com/cometkim/gatsby-plugin-typegen/pull/140))

### v2.2.2

- Fix missing options ([#$81](https://github.com/cometkim/gatsby-plugin-typegen/issues/81))

### v2.2.1

- Fixes bug caused by upstream behavior change ([#93](https://github.com/cometkim/gatsby-plugin-typegen/issues/93))

### v2.2.0

- Use union types instead of enum values ([#78](https://github.com/cometkim/gatsby-plugin-typegen/issues/78))
- Emit schema when add a new frontmatter field ([#82](https://github.com/cometkim/gatsby-plugin-typegen/issues/82))

### v2.1.0

- Use `string` type for the GatsbyJS's `Date` scalar by default. ([#73](https://github.com/cometkim/gatsby-plugin-typegen/pull/73))
- Allow to add type mappings for custom scalars. ([#73](https://github.com/cometkim/gatsby-plugin-typegen/pull/73))
- Avoid using unstable API internally ([#71](https://github.com/cometkim/gatsby-plugin-typegen/pull/71), original issue: [#54](https://github.com/cometkim/gatsby-plugin-typegen/issues/54))

### v2.0.1

- Fix multiple query definitions in plugin documents on Windows ([#66](https://github.com/cometkim/gatsby-plugin-typegen/pull/66), original issue: [#44](https://github.com/cometkim/gatsby-plugin-typegen/issues/44))

### v2.0.0

- **[BREAKING CHANGE]** Generated types are now using global declaration with a namespace (default is `GatsbyTypes`).
- Fixed an issue where the insert types function only worked when documents were changed. ([#43](https://github.com/cometkim/gatsby-plugin-typegen/issues/43))

### v1.1.2

- Export inline fragment subtypes. ([#45](https://github.com/cometkim/gatsby-plugin-typegen/issues/45))
- Insert eslint-disable comment on top of generated file. ([#37](https://github.com/cometkim/gatsby-plugin-typegen/issues/37))

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://blog.cometkim.kr/"><img src="https://avatars3.githubusercontent.com/u/9696352?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Hyeseong Kim</b></sub></a><br /><a href="#maintenance-cometkim" title="Maintenance">🚧</a> <a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=cometkim" title="Code">💻</a> <a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=cometkim" title="Documentation">📖</a> <a href="https://github.com/cometkim/gatsby-plugin-typegen/issues?q=author%3Acometkim" title="Bug reports">🐛</a> <a href="#ideas-cometkim" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/cometkim/gatsby-plugin-typegen/pulls?q=is%3Apr+reviewed-by%3Acometkim" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/relefant"><img src="https://avatars0.githubusercontent.com/u/10079653?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Richard Sewell</b></sub></a><br /><a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=relefant" title="Code">💻</a> <a href="#maintenance-relefant" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/d4rekanguok"><img src="https://avatars2.githubusercontent.com/u/3383539?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Derek Nguyen</b></sub></a><br /><a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=d4rekanguok" title="Code">💻</a> <a href="#maintenance-d4rekanguok" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://specific.solutions.limited"><img src="https://avatars1.githubusercontent.com/u/948178?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vincent Khougaz</b></sub></a><br /><a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=sdobz" title="Code">💻</a></td>
    <td align="center"><a href="https://0xabcdef.com/"><img src="https://avatars0.githubusercontent.com/u/690661?v=4?s=100" width="100px;" alt=""/><br /><sub><b>JongChan Choi</b></sub></a><br /><a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=disjukr" title="Code">💻</a> <a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=disjukr" title="Documentation">📖</a></td>
    <td align="center"><a href="http://www.johnrom.com"><img src="https://avatars3.githubusercontent.com/u/1881482?v=4?s=100" width="100px;" alt=""/><br /><sub><b>John Rom</b></sub></a><br /><a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=johnrom" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Js-Brecht"><img src="https://avatars3.githubusercontent.com/u/1935258?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jeremy Albright</b></sub></a><br /><a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=Js-Brecht" title="Code">💻</a> <a href="https://github.com/cometkim/gatsby-plugin-typegen/issues?q=author%3AJs-Brecht" title="Bug reports">🐛</a> <a href="#ideas-Js-Brecht" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/cometkim/gatsby-plugin-typegen/pulls?q=is%3Apr+reviewed-by%3AJs-Brecht" title="Reviewed Pull Requests">👀</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://www.opencore.com"><img src="https://avatars2.githubusercontent.com/u/122850?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lars Francke</b></sub></a><br /><a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=lfrancke" title="Documentation">📖</a></td>
    <td align="center"><a href="https://haspar.us"><img src="https://avatars0.githubusercontent.com/u/15332326?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Piotr Monwid-Olechnowicz</b></sub></a><br /><a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=hasparus" title="Documentation">📖</a></td>
    <td align="center"><a href="http://edykim.com"><img src="https://avatars3.githubusercontent.com/u/33057457?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Edward Kim</b></sub></a><br /><a href="https://github.com/cometkim/gatsby-plugin-typegen/issues?q=author%3Aedykim" title="Bug reports">🐛</a> <a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=edykim" title="Code">💻</a></td>
    <td align="center"><a href="http://forivall.com"><img src="https://avatars1.githubusercontent.com/u/760204?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Emily Marigold Klassen</b></sub></a><br /><a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=forivall" title="Documentation">📖</a></td>
    <td align="center"><a href="http://madebythijmen.nl"><img src="https://avatars.githubusercontent.com/u/10213180?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Thijmen</b></sub></a><br /><a href="#maintenance-ThijmenDeValk" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/GallardoCode"><img src="https://avatars.githubusercontent.com/u/37138993?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ricardo Gallardo</b></sub></a><br /><a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=GallardoCode" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/ofqwx"><img src="https://avatars.githubusercontent.com/u/7224857?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Antonio Aznarez</b></sub></a><br /><a href="https://github.com/cometkim/gatsby-plugin-typegen/commits?author=ofqwx" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Backers

Thank you to all our backers! 🙏 [[Become a backers](https://opencollective.com/gatsby-plugin-typegen/contribute)]

<a href="https://opencollective.com/gatsby-plugin-typegen"><img src="https://opencollective.com/gatsby-plugin-typegen/individuals.svg?width=890"></a>

## Sponsors

Does your company has large GatsbyJS codebase? Consider supporting this project! It can help contributors to develop tools and discover patterns so that we can use GatsbyJS more soundly. [[Become a sponsor](https://opencollective.com/gatsby-plugin-typegen/contribute)]

<a href="https://opencollective.com/gatsby-plugin-typegen/sponsor/0/website" target="_blank"><img src="https://opencollective.com/gatsby-plugin-typegen/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/gatsby-plugin-typegen/sponsor/1/website" target="_blank"><img src="https://opencollective.com/gatsby-plugin-typegen/sponsor/1/avatar.svg"></a>

## Acknowledgements

- [graphql-code-generator](https://graphql-code-generator.com/) by [@dotansimha](https://github.com/dotansimha)\
  The where this plugin started from.

- [gatsby-plugin-graphql-codegen](https://github.com/d4rekanguok/gatsby-typescript/tree/master/packages/gatsby-plugin-graphql-codegen) by [@d4rekanguok](https://github.com/d4rekanguok)\
  Has almost same goal, but little bit different how handle GraphQL documents. @d4rekanguok also makes great contribution to this plugin as well!

- [gatsby-plugin-extract-code](https://github.com/NickyMeuleman/gatsby-plugin-extract-schema) by [@NickyMeuleman](https://github.com/NickyMeuleman)\
  Gives me an idea of ESLint integraiton.

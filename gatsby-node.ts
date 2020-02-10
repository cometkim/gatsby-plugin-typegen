import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { promisify } from 'util';
import glob from 'glob';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce';
import normalize from 'normalize-path';
import { GraphQLSchema } from 'graphql';

import { GatsbyNode } from 'gatsby';
import { graphql, introspectionQuery } from 'gatsby/graphql';
import getGatsbyDependents from 'gatsby/dist/utils/gatsby-dependents';

import { loadDocuments, loadSchema } from '@graphql-toolkit/core';
import { CodeFileLoader } from '@graphql-toolkit/code-file-loader';
import { JsonFileLoader } from '@graphql-toolkit/json-file-loader';
import { Source } from '@graphql-toolkit/common';

import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptOperationsPlugin from '@graphql-codegen/typescript-operations';
import * as typescriptResolversPlugin from '@graphql-codegen/typescript-resolvers';

import { PluginOptions } from './types';

const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const resolve = (...paths: string[]) => path.resolve(process.cwd(), ...paths);
const log = (message: string) => console.log(`[gatsby-plugin-typegen] ${message}`);

const loadDocumentsWithConfig = (pointers: string | string[]) => loadDocuments(pointers, {
  loaders: [new CodeFileLoader()]
})
const loadSchemaWithConfig = (pointers: string | string[]) => loadSchema(pointers, {
  loaders: [new JsonFileLoader()]
})

const DOCUMENTS_GLOB = resolve('src/**/*.{ts,tsx}');
const DEFAULT_SCHEMA_OUTPUT_PATH = resolve('.cache/caches/gatsby-plugin-typegen/schema.json');
const DEFAULT_TYPE_DEFS_OUTPUT_PATH = resolve('node_modules/generated/types/gatsby.ts');

/**
 * (?<CallExpressionName>useStaticQuery
 *   (?<TypeTemplate><
 *     (?<TypeArgument>\S*)
 *   >)?
 * )
 * \([\s\S]*?
 * graphql
 * (?<TemplateLiteral>`\s*?
 *   (?<QueryDefinitionStart>query
 *     (?<QueryName>\S*)
 *     [^{]?\{
 *   )
 *   [^`]*?
 * `)
 */
const STATIC_QUERY_HOOK_REGEXP = /(?<CallExpressionName>useStaticQuery(?<TypeTemplate><(?<TypeArgument>\S*)>)?)\([\s\S]*?graphql(?<TemplateLiteral>`\s*?(?<QueryDefinitionStart>query (?<QueryName>\S*)[^{]{)[^`]*?`)/g
const STATIC_QUERY_HOOK_REPLACER = (substring: string, ...args: any[]): string => {
  const { length: l, [l - 1]: groups } = args;
  return substring.replace(groups['CallExpressionName'], `useStaticQuery<${groups['QueryName']}Query>`);
}

/**
 * (?<JsxTagOpening><StaticQuery
 *   (?<TagTypeTemplate><
 *     (?<TagTypeArgument>\S+)
 *   >)?
 * )
 * [\s\S]+?
 * query={
 * [\s\S]*?
 * graphql
 * (?<TemplateLiteral>`\s*?
 *   (?<QueryDefinitionStart>query
 *     (?<QueryName>\S*)
 *     [^{]?\{
 *   )
 *   [^`]*?
 * `)
 */
const STATIC_QUERY_COMPONENT_REGEXP = /(?<JsxTagOpening><StaticQuery(?<TagTypeTemplate><(?<TagTypeArgument>\S+)>)?)[\s\S]+?query={[\s\S]*?graphql(?<TemplateLiteral>`\s*?(?<QueryDefinitionStart>query (?<QueryName>\S*)[^{]?\{)[^`]*`)/g
const STATIC_QUERY_COMPONENT_REPLACER = (substring: string, ...args: any[]): string => {
  const { length: l, [l - 1]: groups } = args;
  return substring.replace(groups['JsxTagOpening'], `<StaticQuery<${groups['QueryName']}Query>`);
}

export const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async ({
  store,
  reporter,
}, options) => {
  const {
    schemaOutputPath = DEFAULT_SCHEMA_OUTPUT_PATH,
    typeDefsOutputPath = DEFAULT_TYPE_DEFS_OUTPUT_PATH,
    autoFix = true,
  } = options as PluginOptions;

  const findFiles = async () => {
    // Copied from gatsby/packages/gatsby/src/query/query-compiler.js

    const resolveThemes = (themes = []) =>
      themes.reduce((merged, theme) => {
        // @ts-ignore
        merged.push(theme.themeDir)
        return merged;
      }, []);

    const {
      program,
      themes,
      flattenedPlugins,
      components,
    } = store.getState();

    const basePath = program.directory;
    const additionalPaths: string[] = resolveThemes(
      themes.themes ?? flattenedPlugins.map((plugin: any) => ({
        themeDir: plugin.pluginFilepath,
      })),
    );

    const filesRegex = '*.+(t|j)s?(x)';
    // Pattern that will be appended to searched directories.
    // It will match any .js, .jsx, .ts, and .tsx files, that are not
    // inside <searched_directory>/node_modules.
    const pathRegex = `/{${filesRegex},!(node_modules)/**/${filesRegex}}`;

    const modulesThatUseGatsby = await getGatsbyDependents();

    const files = [
      path.join(basePath, 'src'),
      // Copy note:
      // this code locates the source files .cache/fragments/*.js was copied from
      // the original query-compiler.js handles duplicates more gracefully, codegen generates duplicate types
      ...additionalPaths.map(additional => path.join(additional, 'src')),
      ...modulesThatUseGatsby.map(module => module.path),

      // We should be able to remove the following and preliminary tests do suggest
      // that they aren't needed anymore since we transpile node_modules now
      // However, there could be some cases (where a page is outside of src for example)
      // that warrant keeping this and removing later once we have more confidence (and tests)

      // Ensure all page components added as they're not necessarily in the
      // pages directory e.g. a plugin could add a page component. Plugins
      // *should* copy their components (if they add a query) to .cache so that
      // our babel plugin to remove the query on building is active.
      // Otherwise the component will throw an error in the browser of
      // "graphql is not defined".
      ...components.keys() as string[],
    ].reduce((merged, dir) => [
      ...merged,
      ...glob.sync(path.join(dir, pathRegex), {
        nodir: true,
      }),
    ], [] as string[])
    .filter(d => !d.match(/\.d\.ts$/))
    .map(f => normalize(f));

    return [...new Set(files)];
  };

  // Wait for first extraction
  const docLookupActivity = reporter.activityTimer(
    `lookup graphql documents for type generation`,
    {
      parentSpan: {},
    }
  );
  docLookupActivity.start();
  const files = await findFiles();
  docLookupActivity.end();

  const config = {
    schemaAst: {} as GraphQLSchema,
    filename: typeDefsOutputPath,
    plugins: [
      { typescript: {} },
      { typescriptOperations: {} },
      { typescriptResolvers: {} },
    ],
    pluginMap: {
      typescript: typescriptPlugin,
      typescriptOperations: typescriptOperationsPlugin,
      typescriptResolvers: typescriptResolversPlugin,
    },
    config: {
      avoidOptionals: true,
      maybeValue: 'T',
      namingConvention: {
        typeNames: 'keep',
        enumValues: 'keep',
        transformUnderscore: false,
      },
      addUnderscoreToArgsType: true,
      skipTypename: true,
    },
  };

  const watcher = chokidar.watch([
    schemaOutputPath,
    DOCUMENTS_GLOB,
  ], {
    ignored: [
      typeDefsOutputPath
    ],
  });

  let cache = '';
  let documents: Source[];
  let firstRun = true;

  const writeTypeDefinition = async () => {
    const generateSchemaActivity = reporter.activityTimer(
      `generate graphql typescript`,
      {
        parentSpan: {},
      },
    );
    generateSchemaActivity.start();
    // @ts-ignore
    const output = await codegen({
      ...config,
      documents,
    });
    await mkdir(path.dirname(typeDefsOutputPath), { recursive: true });
    await writeFile(typeDefsOutputPath, output, 'utf-8');
    generateSchemaActivity.end();
    log(`Type definitions are generated into ${typeDefsOutputPath}`);
  };


  const extractSchema = async () => {
    const { schema } = store.getState();
    const { data: fullSchema } = await graphql(schema, introspectionQuery);
    const output = JSON.stringify(fullSchema, null, 2);
    const sha1sum = crypto.createHash('sha1').update(output).digest('hex');
    if (cache !== sha1sum) {
      cache = sha1sum;
      await writeFile(schemaOutputPath, output, 'utf-8');
      log(`Schema file extracted to ${schemaOutputPath}!`);
      config.schemaAst = await loadSchemaWithConfig(schemaOutputPath);

      if (firstRun) {
        documents = await loadDocumentsWithConfig(files);
        log('Documents are loaded');

        await writeTypeDefinition();

        // Register document watcher
        watcher
          .on('add', onWatch)
          .on('change', onWatch)
        ;

        firstRun = false;
      }
    }
  };

  const fixDocuments = async (filePath: string) => {
    const code = await readFile(filePath, 'utf-8');
    const fixed = code
      .replace(STATIC_QUERY_HOOK_REGEXP, STATIC_QUERY_HOOK_REPLACER)
      .replace(STATIC_QUERY_COMPONENT_REGEXP, STATIC_QUERY_COMPONENT_REPLACER);

    if (code !== fixed) {
      await writeFile(filePath, fixed, 'utf-8');
    }
  };

  const onWatch = debounce(async (filePath: string) => {
    const changed = documents.findIndex(document => document.location === filePath)
    if (changed !== -1) {
      documents[changed] = (await loadDocumentsWithConfig(filePath))[0];
    }
    await extractSchema();
    await writeTypeDefinition();

    if (autoFix && filePath !== schemaOutputPath) {
      await fixDocuments(filePath);
    }
  }, 1000);


  // Wait for first extraction
  await extractSchema();
};

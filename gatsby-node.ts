import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import chokidar from 'chokidar';
import debounce from 'lodash.debounce';
import { promisify } from 'util';
import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptOperationsPlugin from '@graphql-codegen/typescript-operations';
import * as typescriptResolversPlugin from '@graphql-codegen/typescript-resolvers';
import { loadDocuments, loadSchema } from 'graphql-toolkit';
import { GatsbyNode } from 'gatsby';
// @ts-ignore
import { graphql, introspectionQuery } from 'gatsby/graphql';

import { PluginOptions } from './types';

const writeFilePromise = promisify(fs.writeFile);

const resolve = (...paths: string[]) => path.resolve(process.cwd(), ...paths);
const log = (message: string) => console.log(`[gatsby-plugin-typegen] ${message}`);

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

export const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async ({ store }, options) => {
  const {
    schemaOutputPath = DEFAULT_SCHEMA_OUTPUT_PATH,
    typeDefsOutputPath = DEFAULT_TYPE_DEFS_OUTPUT_PATH,
    autoFix = true,
  } = options as PluginOptions;

  let cache = '';

  const extractSchema = async () => {
    const { schema } = store.getState();
    const { data: fullSchema } = await graphql(schema, introspectionQuery);
    const output = JSON.stringify(fullSchema, null, 2);
    const sha1sum = crypto.createHash('sha1').update(output).digest('hex');
    if (cache !== sha1sum) {
      cache = sha1sum;
      await writeFilePromise(schemaOutputPath, output, 'utf-8');
      log(`Schema file extracted to ${schemaOutputPath}!`);
    }
  };

  // Wait for first extraction
  await extractSchema();
  const schemaAst = await loadSchema(schemaOutputPath);
  const documents = await loadDocuments(resolve(DOCUMENTS_GLOB));
  log('Documents are loaded');

  const config = {
    schemaAst,
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

  const writeTypeDefinition = debounce(async () => {
    // @ts-ignore
    const output = await codegen({
      ...config,
      documents,
    });
    await fs.promises.mkdir(path.dirname(typeDefsOutputPath), { recursive: true });
    await fs.promises.writeFile(typeDefsOutputPath, output, 'utf-8');
    log(`Type definitions are generated into ${typeDefsOutputPath}`);
  }, 1000);

  const fixDocuments = async (filePath: string) => {
    const code = await fs.promises.readFile(filePath, 'utf-8');
    const fixed = code
      .replace(STATIC_QUERY_HOOK_REGEXP, STATIC_QUERY_HOOK_REPLACER)
      .replace(STATIC_QUERY_COMPONENT_REGEXP, STATIC_QUERY_COMPONENT_REPLACER);

    if (code !== fixed) {
      fs.promises.writeFile(filePath, fixed, 'utf-8');
    }
  };

  const onWatch = async (filePath: string) => {
    const changed = documents.findIndex(document => document.filePath === filePath)
    if (changed !== -1) {
      documents[changed] = (await loadDocuments(filePath))[0];
    }
    writeTypeDefinition();

    if (autoFix && filePath !== schemaOutputPath) {
      fixDocuments(filePath);
    }
  };

  const watcher = chokidar.watch([
    schemaOutputPath,
    DOCUMENTS_GLOB,
  ]);

  watcher
    .on('add', onWatch)
    .on('change', onWatch)
  ;

  store.subscribe(extractSchema);
};

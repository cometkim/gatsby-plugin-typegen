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
import { loadDocuments, loadSchema, DocumentFile } from 'graphql-toolkit';
import { GatsbyNode } from 'gatsby';
// @ts-ignore
import { graphql, introspectionQuery } from 'gatsby/graphql';

import { PluginOptions } from './types';
import { GraphQLSchema } from 'graphql';

const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

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
    ]
  });

  let cache = '';
  let documents: DocumentFile[];
  let firstRun = true;

  const writeTypeDefinition = async () => {
    // @ts-ignore
    const output = await codegen({
      ...config,
      documents,
    });
    await mkdir(path.dirname(typeDefsOutputPath), { recursive: true });
    await writeFile(typeDefsOutputPath, output, 'utf-8');
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
      config.schemaAst = await loadSchema(schemaOutputPath);

      if (firstRun) {
        documents = await loadDocuments(resolve(DOCUMENTS_GLOB));
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
    const changed = documents.findIndex(document => document.filePath === filePath)
    if (changed !== -1) {
      documents[changed] = (await loadDocuments(filePath))[0];
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

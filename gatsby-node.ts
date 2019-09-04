import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import chokidar from 'chokidar';
import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import { loadDocuments, loadSchema } from 'graphql-toolkit';

import { GatsbyNode } from 'gatsby';
// @ts-ignore
import { graphql, introspectionQuery } from 'gatsby/graphql';

const resolve = (...paths: string[]) => path.resolve(process.cwd(), ...paths);
const log = (message: string) => console.log(`[gatsby-plugin-typegen] ${message}`);
const schemaOutputPath = resolve('.cache/caches/gatsby-plugin-typegen/schema.json');

export const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async ({ store }) => {
  let cache = '';

  const extractSchema = async () => {
    const { schema } = store.getState();
    const { data: fullSchema } = await graphql(schema, introspectionQuery);
    const output = JSON.stringify(fullSchema, null, 2);
    const sha1sum = crypto.createHash('sha1').update(output).digest('hex');
    if (cache !== sha1sum) {
      cache = sha1sum;
      await fs.promises.writeFile(schemaOutputPath, output, 'utf-8');
      log('Schema file has been updated!');
    }
  };

  // Wait for first extraction
  await extractSchema();
  const schemaAst = await loadSchema(schemaOutputPath);
  const documents = await loadDocuments(resolve('src/**/*.{ts,tsx}'));
  log('Documents have been loaded');

  const writeTypeDefinition = async () => {
    const config = {
      schemaAst,
      documents,
      plugins: [{
        typescript: {
          avoidOptionals: true,
          maybeValue: 'T',
          namingConvention: {
            enumValues: 'keep',
            transformUnderscore: false,
          },
        },
      }],
      pluginMap: {
        typescript: typescriptPlugin,
      },
      // Not really necessary
      filename: '',
      config: {},
    }
    // @ts-ignore
    const output = await codegen(config);
    await fs.promises.mkdir(resolve('generated/types'), { recursive: true });
    await fs.promises.writeFile(resolve('generated/types/gatsby.ts'), output, 'utf-8');
    log('Type definitions have been generated');
  };


  const watcher = chokidar.watch([
    schemaOutputPath,
    resolve('src'),
  ]);

  watcher
    .on('add', writeTypeDefinition)
    .on('change', writeTypeDefinition)
  ;

  store.subscribe(extractSchema);
};

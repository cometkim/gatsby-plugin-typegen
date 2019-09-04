import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { promisify } from 'util';

import { GatsbyNode } from 'gatsby';
// @ts-ignore
import { graphql, introspectionQuery } from 'gatsby/graphql';

const writeFile = promisify(fs.writeFile);
const schemaOutputPath = path.resolve(process.cwd(), '.cache/caches/gatsby-plugin-extract-schema/schema.json');

export const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async ({ store }) => {
  let cache = '';

  store.subscribe(async () => {
    const { schema } = store.getState();
    const { data: fullSchema } = await graphql(schema, introspectionQuery);
    const result = JSON.stringify(fullSchema, null, 2);
    const sha1sum = crypto.createHash('sha1').update(result).digest('hex');
    if (cache !== sha1sum) {
      cache = sha1sum;
      await writeFile(schemaOutputPath, JSON.stringify(fullSchema, null, 2), 'utf-8');
      console.log('[extract-schema] Schema file has been updated!');
    }
  });
};

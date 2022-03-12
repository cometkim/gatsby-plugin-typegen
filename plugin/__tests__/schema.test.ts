import * as path from 'path';
import * as fs from 'fs';
import { buildSchema, printSchema } from 'gatsby/graphql';

import {
  filterDevOnlySchema,
  filterPluginSchema,
} from '../src/internal/utils';

describe('stable schema', () => {
  it('should not containt dev only fields/values, and derived from plugin metadata', async () => {
    const inputSchemaFile = path.resolve(__dirname, './__fixtures__/gatsby-schema.graphql');
    const inputSchema = buildSchema(await fs.promises.readFile(inputSchemaFile, 'utf-8'));
    const outputSchema = filterPluginSchema(filterDevOnlySchema(inputSchema));
    expect(printSchema(outputSchema)).toMatchSnapshot();
  });
});

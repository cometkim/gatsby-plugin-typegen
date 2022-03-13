import * as path from 'path';
import * as fs from 'fs';
import { buildSchema, parse } from 'gatsby/graphql';

import { filterDevOnlySchema, filterPluginSchema } from '../src/internal/utils';
import { testReporter } from '../test/reporter';
import { makeCodegenService } from '../src/services/codegen';

describe('codegen service', () => {
  test('flow', async () => {
    const writeFileContent = jest.fn<Promise<void>, [string, string]>();

    const codegen = makeCodegenService({
      outputPath: 'codegen.flow.js',
      namespace: 'GatsbyTypes',
      language: 'flow',
      reporter: testReporter,
      includeResolvers: true,
      customScalars: {},
      writeFileContent,
    });

    const inputSchemaFile = path.resolve(__dirname, './__fixtures__/gatsby-schema.graphql');
    const inputSchema = buildSchema(await fs.promises.readFile(inputSchemaFile, 'utf-8'));
    const schema = filterPluginSchema(filterDevOnlySchema(inputSchema));

    const document = parse(`
      query Test {
        site {
          siteMetadata {
            title
          }
        }
      }
    `);

    await codegen({ schema, documents: [{ document }] });

    const [outputPath, content] = writeFileContent.mock.calls[0];
    expect(content).toMatchSnapshot(outputPath);
  });
});

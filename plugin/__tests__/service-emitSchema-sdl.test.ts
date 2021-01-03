import * as path from 'path';
import * as fs from 'fs';
import { buildSchema } from 'gatsby/graphql';

import { testReporter } from '../test/reporter';
import { stabilizeSchema } from '../src/internal/utils';
import { makeEmitSchemaService } from '../src/services/emitSchema';

describe('emitSchema service', () => {
  it('should emits schema to configured paths in configuired formats', async () => {
    const writeFileContent = jest.fn<Promise<void>, [string, string]>();

    const emitSchema = makeEmitSchemaService({
      configMap: {
        'schema.graphql': {
          format: 'sdl',
          commentDescriptions: true,
          omitPluginMetadata: true,
        },
      },
      reporter: testReporter,
      writeFileContent,
    });

    const inputSchemaFile = path.resolve(__dirname, './__fixtures__/gatsby-schema.graphql');
    const inputSchema = buildSchema(await fs.promises.readFile(inputSchemaFile, 'utf-8'));
    const stableSchema = stabilizeSchema(inputSchema);

    await emitSchema(stableSchema);

    for (const [filePath, content] of writeFileContent.mock.calls) {
      expect(content).toMatchSnapshot(filePath);
    }
  });
});

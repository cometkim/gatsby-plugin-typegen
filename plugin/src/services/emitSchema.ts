import type { GraphQLSchema } from 'gatsby/graphql';
import {
  printSchema,
  introspectionFromSchema,
} from 'gatsby/graphql';

import type { Config } from '../internal/config';
import type { TypegenReporter } from '../internal/reporter';
import { filterPluginSchema } from '../internal/utils';

interface EmitSchemaService {
  (schema: GraphQLSchema): Promise<void>;
}

interface MakeEmitSchemaService {
  (deps: {
    configMap: Config['emitSchema'],
    reporter: TypegenReporter,
    writeFileContent: (path: string, content: string) => Promise<void>,
  }): EmitSchemaService;
}

export const makeEmitSchemaService: MakeEmitSchemaService = ({
  configMap,
  reporter,
  writeFileContent,
}) => {
  return async schema => {
    const entries = Object.entries(configMap);
    if (entries.length === 0) {
      return;
    }

    await Promise.all(
      entries.map(async ([filePath, config]) => {
        const activity = reporter.activity(`emit schema into ${filePath}`);
        activity.start();

        const {
          format,
          commentDescriptions,
          omitPluginMetadata,
        } = config;

        try {
          let outputSchema = schema;
          if (omitPluginMetadata) {
            outputSchema = filterPluginSchema(outputSchema);
          }
          switch (format) {
            case 'sdl': {
              await writeFileContent(
                filePath,
                printSchema(outputSchema, { commentDescriptions }),
              );
            }
            case 'introspection': {
              await writeFileContent(
                filePath,
                JSON.stringify(
                  introspectionFromSchema(outputSchema, {
                    descriptions: true,
                    schemaDescription: true,
                    directiveIsRepeatable: true,
                    inputValueDeprecation: true,
                    specifiedByUrl: true,
                  }),
                  null,
                  2,
                ),
              );
            }
          }
        } catch (e) {
          activity.panic(e);
        } finally {
          activity.end();
        }
      }),
    );
  };
};

import type { GraphQLSchema } from 'gatsby/graphql';
import {
  lexicographicSortSchema,
  printSchema,
  introspectionFromSchema,
} from 'gatsby/graphql';

import type { Config } from '../internal/config';
import type { TypegenReporter } from '../internal/reporter';
import { filterDevOnlySchema, filterPluginSchema } from '../internal/utils';

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

    const stableSchema = lexicographicSortSchema(
      filterDevOnlySchema(schema),
    );

    void await Promise.all(
      entries.map(([filePath, config]) => {
        reporter.info(`emitting schema into ${filePath}`);

        const {
          format,
          commentDescriptions,
          omitPluginMetadata,
        } = config;

        let schema = stableSchema;
        if (omitPluginMetadata) {
          schema = filterPluginSchema(schema);
        }

        switch (format) {
          case 'sdl': {
            return writeFileContent(
              filePath,
              printSchema(schema, { commentDescriptions }),
            );
          }
          case 'introspection': {
            return writeFileContent(
              filePath,
              JSON.stringify(
                introspectionFromSchema(schema, { descriptions: commentDescriptions }),
                null,
                2,
              ),
            );
          }
        }
      }),
    );
  };
};

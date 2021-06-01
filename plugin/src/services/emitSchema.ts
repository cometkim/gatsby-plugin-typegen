import {
  printSchema,
  introspectionFromSchema,
  lexicographicSortSchema,
} from 'gatsby/graphql';
import type { NormalizedPluginOptions } from '../internal/config';
import { writeFile } from '../internal/utils';

import type { TypegenContext } from './typegenMachine';

type EmitSchemaServiceDependencies = {
  pluginOptions: NormalizedPluginOptions,
};

interface MakeEmitSchemaService {
  (dependencies: EmitSchemaServiceDependencies): (ctx: TypegenContext) => Promise<void>;
}

export const makeEmitSchemaService: MakeEmitSchemaService = ({
  pluginOptions: {
    emitSchema,
  },
}) => {
  return async (ctx) => {
    if (!ctx.schema) {
      return;
    }

    const schema = lexicographicSortSchema(ctx.schema);

    void await Promise.all(
      Object.entries(emitSchema)
      .map(([filePath, config]) => {
        ctx.reporter?.info(`[typegen] emitting schema into ${filePath}`);
        const { format, commentDescriptions } = config;
        switch (format) {
          case 'sdl': {
            return writeFile(
              filePath,
              printSchema(schema, { commentDescriptions }),
            );
          }
          case 'introspection': {
            return writeFile(
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

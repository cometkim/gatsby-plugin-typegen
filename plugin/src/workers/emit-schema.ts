import type { Reporter } from 'gatsby';
import type { GraphQLSchema } from 'gatsby/graphql';
import type { QueueObject } from 'async';
import type { Option, Callable } from '@cometjs/core';
import type { SchemaOutputOptions } from '../types';

import { cargo, asyncify } from 'async';
import { printSchema, introspectionFromSchema } from 'gatsby/graphql';
import { writeFile } from '../common';

export type EmitSchemaTask = {
  schema: GraphQLSchema,
  entries: Array<[string, SchemaOutputOptions]>,
};

interface SetupEmitSchemaWorkerFn {
  (props: {
    reporter: Reporter,
  }): QueueObject<EmitSchemaTask>;
}
export const setupEmitSchemaWorker: SetupEmitSchemaWorkerFn = ({
  reporter,
}) => {
  const worker = cargo<EmitSchemaTask>(asyncify(async (tasks: EmitSchemaTask[]) => {
    const { length: l, [l - 1]: last } = tasks;
    const { schema, entries } = last;

    for (const [schemaOutputPath, schemaOutputOptions] of entries) {
      const { commentDescriptions = true } = schemaOutputOptions;

      let output: Option<string>;
      switch (schemaOutputOptions.format) {
        case 'sdl':
          output = printSchema(schema, { commentDescriptions });
          break;
        case 'introspection':
          output = JSON.stringify(
            introspectionFromSchema(schema, { descriptions: commentDescriptions }),
            null,
            2,
          );
          break;
      }
      if (output) {
        reporter.verbose(`[typegen] Emit Gatsby schema into ${schemaOutputPath}`);
        await writeFile(schemaOutputPath, output);
      }
    }
  }));

  return worker;
};

import type { Reporter } from 'gatsby';
import type { GraphQLSchema } from 'gatsby/graphql';
import type { AsyncCargo } from 'async';
import type { Option } from '@cometjs/core';
import type { RequiredPluginOptions } from '../plugin-utils';
import type { SchemaOutputOptions } from '../types';

import { cargo, asyncify } from 'async';
import { printSchema, introspectionFromSchema } from 'gatsby/graphql';
import { readFile, writeFile } from '../common';

export type EmitSchemaTask = {
  schema: GraphQLSchema,
  entries: [string, SchemaOutputOptions],
};

export type EmitSchemaWorker = Omit<AsyncCargo, 'push'> & {
  push(task: EmitSchemaTask, cb?: Function): void,
};

interface SetupEmitSchemaWorkerFn {
  (props: {
    reporter: Reporter,
  }): EmitSchemaWorker;
}
export const setupEmitSchemaWorker: SetupEmitSchemaWorkerFn = ({
  reporter,
}) => {
  const worker = cargo(asyncify(async (tasks: EmitSchemaTask[]) => {
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

import { GatsbyNode } from 'gatsby';
import {
  printSchema,
  introspectionFromSchema,
  GraphQLSchema,
} from 'gatsby/graphql';
import FileParser from 'gatsby/dist/query/file-parser';
import { parseGraphQLSDL, Source } from '@graphql-toolkit/common';

import { writeFile, UnwrapPromise, readFile } from './common';
import { setupCodegenWorker, setupInsertTypeWorker, InsertTypeTask } from './workers';
import { requirePluginOptions, RequiredPluginOptions } from './plugin-utils';
import { GatsbyKnownAction } from './gatsby-utils';

// Plugin will track documents what is actually used by Gatsby.
const trackedSource = new Map<string, Source>();

// noop
const noop = () => {};

let pluginOptions: RequiredPluginOptions;
let unsubscribeQueryExtraction: Function;

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = ({
  store,
  reporter,
}, options) => {
  // Validate plugin options earlier.
  pluginOptions = requirePluginOptions(options, { store, reporter });

  reporter.verbose(
    '[typegen] Successfully validate your configuration.\n'
    + JSON.stringify(pluginOptions, null, 2)
  );
};

export const onPreExtractQueries: GatsbyNode['onPreExtractQueries'] = ({
  store,
  reporter,
}) => {
  reporter.verbose('[typegen] Listen on query extraction');

  const fileParser = new FileParser({ parentSpan: null });

  unsubscribeQueryExtraction = store.subscribe(async () => {
    const lastAction = store.getState().lastAction as GatsbyKnownAction;

    if (lastAction.type !== 'QUERY_EXTRACTION_BABEL_SUCCESS') {
      return;
    }

    const { componentPath } = lastAction.payload;

    if (trackedSource.has(componentPath)) {
      return;
    }

    let extractionResult: UnwrapPromise<ReturnType<typeof fileParser.parseFile>>;
    try {
      extractionResult = await fileParser.parseFile(componentPath, noop);
    } catch {
      extractionResult = null;
    }

    if (extractionResult) {
      const document = parseGraphQLSDL(componentPath, extractionResult.map(doc => doc.text).join(''), {});
      trackedSource.set(componentPath, document);
    }
  });
};

export const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async ({
  store,
  reporter,
}) => {
  const {
    language,
    outputPath,
    includeResolvers,
    emitSchema,
    autoFix,
  } = pluginOptions;

  reporter.verbose('[typegen] End-up listening on query extraction.');
  unsubscribeQueryExtraction();

  const schema = store.getState().schema as GraphQLSchema;

  for (const [schemaOutputPath, schemaOutputOptions] of Object.entries(emitSchema)) {
    const { commentDescriptions = true } = schemaOutputOptions;

    let output: string;
    switch (schemaOutputOptions.format) {
      case 'sdl':
        output = printSchema(schema, { commentDescriptions });
        break;
      case 'introspection':
        output = JSON.stringify(introspectionFromSchema(schema, { descriptions: commentDescriptions }), null, 2);
        break;
    }

    reporter.verbose(`[typegen] Emit Gatsby schema into ${schemaOutputPath}`);
    await writeFile(schemaOutputPath, output);
  }

  const codegenWorker = setupCodegenWorker({
    schemaAst: schema,
    language,
    outputPath,
    includeResolvers,
    reporter,
  });

  const pushCodegenTask = () => {
    // @ts-ignore
    codegenWorker.push({ documents: [...trackedSource.values()].filter(Boolean) });
  };

  pushCodegenTask();

  if (process.env.NODE_ENV === 'development') {
    reporter.verbose('[typegen][dev] Watching query changes and re-run workers');

    const insertTypeWorker = autoFix && setupInsertTypeWorker({ reporter });
    const pushInsertTypeTask = (task: InsertTypeTask) => {
      if (!insertTypeWorker) {
        return;
      }
      insertTypeWorker.push(task);
    };

    store.subscribe(async () => {
      const lastAction = store.getState().lastAction as GatsbyKnownAction;

      // Listen gatsby actions
      // - QUERY_EXTRACTED action for page queries.
      // - REPLACE_STATIC_QUERY action for static queries.
      if (lastAction.type !== 'QUERY_EXTRACTED' && lastAction.type !== 'REPLACE_STATIC_QUERY') {
        return;
      }

      const { payload: { query, componentPath } } = lastAction;

      const source = trackedSource.get(componentPath);
      if (source?.rawSDL === query) {
        return;
      }

      const document = parseGraphQLSDL(componentPath, query, {
        noLocation: true,
      });
      trackedSource.set(componentPath, document);

      pushCodegenTask();

      if (pluginOptions.language === 'typescript' && /\.tsx?$/.test(componentPath)) {
        pushInsertTypeTask({ file: componentPath });
      }

      // Flow version is bit more slower because should check the `@flow` comment exist.
      if (pluginOptions.language === 'flow' && /\.jsx?$/.test(componentPath)) {
        const content = await readFile(componentPath);
        const hasFlowComment = content.includes('@flow');
        reporter.verbose(`[typegen] Check if the file has flow comment: ${hasFlowComment}`);
        hasFlowComment && pushInsertTypeTask({ file: componentPath });
      }
    });
  }
};

import path from 'path';
import { stripIndent } from 'common-tags';
import { GatsbyNode } from 'gatsby';
import {
  printSchema,
  introspectionFromSchema,
  GraphQLSchema,
} from 'gatsby/graphql';
import { parseGraphQLSDL, Source } from '@graphql-toolkit/common';
import { gqlPluckFromCodeString } from '@graphql-toolkit/graphql-tag-pluck';
import { Option } from '@cometjs/core';

import { writeFile, readFile, deduplicateFragmentFromDocuments } from './common';
import { setupCodegenWorker, setupInsertTypeWorker } from './workers';
import { requirePluginOptions, RequiredPluginOptions, GRAPHQL_TAG_PLUCK_OPTIONS } from './plugin-utils';
import { GatsbyKnownAction } from './gatsby-utils';

// Plugin will track documents what is actually used by Gatsby.
const trackedSource = new Map<string, Source>();

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

  unsubscribeQueryExtraction = store.subscribe(async () => {
    const lastAction = store.getState().lastAction as GatsbyKnownAction;

    if (lastAction.type !== 'QUERY_EXTRACTION_BABEL_SUCCESS') {
      return;
    }

    const { componentPath } = lastAction.payload;
    if (trackedSource.has(componentPath)) {
      return;
    }

    try {
      const code = await readFile(componentPath);
      const extractedSDL = await gqlPluckFromCodeString(componentPath, code, GRAPHQL_TAG_PLUCK_OPTIONS);
      if (extractedSDL) {
        const document = parseGraphQLSDL(componentPath, extractedSDL, { noLocation: true });
        trackedSource.set(componentPath, document);
      }
    } catch (error) {
      reporter.error(`[typegen] Fail to extract GraphQL documents from ${componentPath}`, error);
    }
  });
};

export const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async ({
  store,
  reporter,
}) => {
  const {
    language,
    namespace,
    outputPath,
    includeResolvers,
    emitSchema,
    emitPluginDocuments,
    autoFix,
  } = pluginOptions;

  reporter.verbose('[typegen] End-up listening on query extraction.');
  unsubscribeQueryExtraction();

  const { program, schema: _schema } = store.getState();
  const basePath = program.directory as string;
  const schema = _schema as GraphQLSchema;

  for (const [schemaOutputPath, schemaOutputOptions] of Object.entries(emitSchema)) {
    const { commentDescriptions = true } = schemaOutputOptions;

    let output: Option<string>;
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

  // Gatsby component paths have forward slashes.  The following filter
  // doesn't work properly on Windows if the matched path uses backslashes
  const srcPath = path.resolve(basePath, 'src').replace(/\\/g, '/');

  const pluginDocuments = Object.values(emitPluginDocuments).some(Boolean) && (
    stripIndent(
      Array.from(trackedSource.entries())
        .filter(([componentPath]) => !componentPath.startsWith(srcPath))
        .map(([, source]) => source.rawSDL)
        .join('\n'),
    )
  );
  if (pluginDocuments) {
    for (const [documentOutputPath, documentOutputOptions] of Object.entries(emitPluginDocuments)) {
      if (!documentOutputOptions) continue;
      reporter.verbose(`[typegen] Emit Gatsby plugin documents into ${documentOutputPath}`);
      await writeFile(path.resolve(basePath, documentOutputPath), pluginDocuments);
    }
  }

  const codegenWorker = setupCodegenWorker({
    schemaAst: schema,
    language,
    namespace,
    outputPath,
    includeResolvers,
    reporter,
  });
  const insertTypeWorker = autoFix && setupInsertTypeWorker({
    language,
    namespace,
    reporter,
  });

  const pushCodegenTask = () => {
    codegenWorker.push({
      documents: deduplicateFragmentFromDocuments([...trackedSource.values()].filter(Boolean)),
    });
  };

  const pushInsertTypeTask = async (componentPath: string) => {
    if (!insertTypeWorker) {
      return;
    }

    if (language === 'typescript' && /\.tsx?$/.test(componentPath)) {
      insertTypeWorker.push({ file: componentPath });
    }

    // Flow version is bit more slower because should check the `@flow` comment exist.
    if (language === 'flow' && /\.jsx?$/.test(componentPath)) {
      const content = await readFile(componentPath);
      const hasFlowComment = content.includes('@flow');
      reporter.verbose(`[typegen] Check if the file has flow comment: ${hasFlowComment}`);
      hasFlowComment && insertTypeWorker.push({ file: componentPath });
    }
  };

  pushCodegenTask();

  for (const componentPath of trackedSource.keys()) {
    pushInsertTypeTask(componentPath);
  }

  if (process.env.NODE_ENV === 'development') {
    reporter.verbose('[typegen][dev] Watching query changes and re-run workers');

    store.subscribe(() => {
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

      const document = parseGraphQLSDL(componentPath, query, { noLocation: true });
      trackedSource.set(componentPath, document);

      pushCodegenTask();
      pushInsertTypeTask(componentPath);
    });
  }
};

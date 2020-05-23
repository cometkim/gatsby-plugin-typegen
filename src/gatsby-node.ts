import type { GatsbyNode } from 'gatsby';
import type { Callable } from '@cometjs/core';
import type { Source } from '@graphql-toolkit/common';
import type { GatsbyKnownAction, GatsbyStore } from './gatsby-utils';

import path from 'path';
import { stripIndent } from 'common-tags';
import { parseGraphQLSDL } from '@graphql-toolkit/common';
import { gqlPluckFromCodeString } from '@graphql-toolkit/graphql-tag-pluck';

import {
  writeFile,
  readFile,
  deduplicateFragmentFromDocuments,
} from './common';
import {
  setupCodegenWorker,
  setupEmitSchemaWorker,
  setupInsertTypeWorker,
} from './workers';
import {
  requirePluginOptions,
  RequiredPluginOptions,
  GRAPHQL_TAG_PLUCK_OPTIONS,
} from './plugin-utils';

// Plugin will track documents what is actually used by Gatsby.
const trackedSource = new Map<string, Source>();

let pluginOptions: RequiredPluginOptions;
let unsubscribeQueryExtraction: Callable;

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = ({
  store: _store,
  reporter,
}, options) => {
  const store = _store as GatsbyStore;

  // Validate plugin options earlier.
  pluginOptions = requirePluginOptions(options, { store, reporter });

  reporter.verbose(
    '[typegen] Successfully validate your configuration.\n'
    + JSON.stringify(pluginOptions, null, 2),
  );
};

export const onPreExtractQueries: GatsbyNode['onPreExtractQueries'] = ({
  store: _store,
  reporter,
}) => {
  const store = _store as GatsbyStore;

  reporter.verbose('[typegen] Listen on query extraction');

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  unsubscribeQueryExtraction = store.subscribe(async () => {
    const lastAction = store.getState().lastAction;

    if (lastAction.type !== 'QUERY_EXTRACTION_BABEL_SUCCESS') {
      return;
    }

    const { componentPath } = lastAction.payload;
    if (trackedSource.has(componentPath)) {
      return;
    }

    try {
      const code = await readFile(componentPath);
      const extractedSDL = await gqlPluckFromCodeString(
        componentPath,
        code,
        GRAPHQL_TAG_PLUCK_OPTIONS,
      );
      if (extractedSDL) {
        const document = parseGraphQLSDL(componentPath, extractedSDL, { noLocation: true });
        trackedSource.set(componentPath, document);
      }
    } catch (error) {
      reporter.error(`[typegen] Fail to extract GraphQL documents from ${componentPath}`, error);
    }
  }) as Callable;
};

export const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async ({
  store: _store,
  reporter,
}) => {
  const store = _store as GatsbyStore;
  const {
    language,
    namespace,
    outputPath,
    includeResolvers,
    emitSchema,
    emitPluginDocuments,
    autoFix,
    scalars,
  } = pluginOptions;

  reporter.verbose('[typegen] End-up listening on query extraction.');
  unsubscribeQueryExtraction();

  const state = store.getState();
  const basePath = state.program.directory;
  const pluginState = {
    schema: state.schema,
  };

  const emitSchemaEntries = Object.entries(emitSchema);
  const emitSchemaWorker = emitSchemaEntries.length > 0 && setupEmitSchemaWorker({
    reporter,
  });
  const pushEmitSchemaTask = () => {
    if (!emitSchemaWorker) {
      return;
    }
    emitSchemaWorker.push({
      schema: pluginState.schema,
      entries: emitSchemaEntries,
    });
  };

  const codegenWorker = setupCodegenWorker({
    language,
    namespace,
    outputPath,
    includeResolvers,
    reporter,
    scalarMap: scalars,
  });
  const pushCodegenTask = () => {
    codegenWorker.push({
      schema: pluginState.schema,
      documents: deduplicateFragmentFromDocuments([...trackedSource.values()].filter(Boolean)),
    });
  };

  const insertTypeWorker = autoFix && setupInsertTypeWorker({
    language,
    namespace,
    reporter,
  });
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
      reporter.verbose(`[typegen] Check if the file has flow comment: ${hasFlowComment.toString()}`);
      hasFlowComment && insertTypeWorker.push({ file: componentPath });
    }
  };

  // Task 1. Emit schema
  pushEmitSchemaTask();

  // Task 2. Emit plugin documents
  // FIXME: Move this to a seperated service like others.
  // (not necessarily for now becuase this is one-time job)
  //
  // Gatsby component paths have forward slashes.
  // The following filter doesn't work properly on Windows if the matched path uses backslashes
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

  // Task 3. Codegen
  pushCodegenTask();

  // Task 4. Auto-fixing!
  for (const componentPath of trackedSource.keys()) {
    void pushInsertTypeTask(componentPath);
  }

  // Subscribe GatsbyJS store and handle changes in development mode
  if (process.env.NODE_ENV === 'development') {
    reporter.verbose('[typegen] Watching schema/query changes and re-run workers');

    store.subscribe(() => {
      const state = store.getState();
      const lastAction = state.lastAction;

      // Listen gatsby actions
      // - SET_SCHEMA action for schema changing.
      // - QUERY_EXTRACTED action for page queries.
      // - REPLACE_STATIC_QUERY action for static queries.

      if (lastAction.type === 'SET_SCHEMA') {
        pluginState.schema = state.schema;
        pushEmitSchemaTask();
        pushCodegenTask();
      }

      if (lastAction.type === 'QUERY_EXTRACTED' || lastAction.type === 'REPLACE_STATIC_QUERY') {
        const { payload: { query, componentPath } } = lastAction;
        const source = trackedSource.get(componentPath);
        if (source?.rawSDL === query) {
          return;
        }

        const document = parseGraphQLSDL(componentPath, query, { noLocation: true });
        trackedSource.set(componentPath, document);

        pushCodegenTask();
        void pushInsertTypeTask(componentPath);
      }
    });
  }
};

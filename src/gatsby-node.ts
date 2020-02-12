import path from 'path';
import chokidar from 'chokidar';
import { printSchema } from 'gatsby/graphql';
import { GatsbyNode } from 'gatsby';
import { loadTypedefs } from '@graphql-toolkit/core';
import { Source } from '@graphql-toolkit/common';
import { CodeFileLoader } from '@graphql-toolkit/code-file-loader';

import { writeFile } from './common';
import { setupCodegenWorker, setupInsertTypeWorker } from './workers';
import { requirePluginOptions, RequiredPluginOptions } from './plugin-utils';
import { extractSchemaFromStore, loadGatsbyFiles } from './gatsby-utils';

const codeFileLoader = new CodeFileLoader();
const loadDocumentsFromFile = (file: string) => loadTypedefs(file, {
  loaders: [codeFileLoader],
});

let pluginOptions: RequiredPluginOptions;

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = ({
  store,
  reporter,
}, options) => {
  // Validate plugin options earlier.
  pluginOptions = requirePluginOptions(options, { store, reporter });
};

export const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async ({
  store,
  reporter,
}) => {
  const { program } = store.getState();
  const basePath = program.directory as string;

  // - validate options
  const {
    language,
    outputPath,
    includeResolvers,
    ignorePatterns,
    emitSchema,
    autoFix,
  } = pluginOptions;

  // extract schema
  reporter.verbose('[typegen] Extract full schema AST');
  const schemaAst = await extractSchemaFromStore({ store });

  // emit schema
  for (const [schemaOutputPath, schemaOutputOptions] of Object.entries(emitSchema)) {
    reporter.verbose(`[typegen] Emit schema ast into ${schemaOutputPath}`);
    let output: string;
    switch (schemaOutputOptions.format) {
      case 'graphql':
        output = printSchema(schemaAst);
        break;
      case 'json':
        output = JSON.stringify(schemaAst.astNode, null, 2);
        break;
    }
    await writeFile(schemaOutputPath, output);
  }

  const gatsbyFiles = await loadGatsbyFiles({ store });

  reporter.verbose('[typegen] Load initial documents');
  const documentCache = new Map<string, Source[] | undefined>();
  for (const file of gatsbyFiles) {
    try {
      const documents = await loadDocumentsFromFile(file);
      documentCache.set(file, documents);
    } catch {
      documentCache.set(file, undefined);
    }
  }
  const getDocuments = () => (
    [...documentCache.values()]
      .filter(Boolean)
      // flat
      // @ts-ignore
      .reduce((acc, arr) => acc.concat(arr), [])
  ) as Source[];

  const codegenWorker = setupCodegenWorker({
    schemaAst,
    language,
    outputPath,
    includeResolvers,
    reporter,
  });
  codegenWorker.push({ documents: getDocuments() });

  if (process.env.NODE_ENV === 'development') {
    const insertTypeWorker = autoFix && setupInsertTypeWorker({ reporter });
    const watcher = chokidar.watch([

      // static documents
      ...gatsbyFiles,

      // user documents
      path.resolve(basePath, 'src/**/*.+(t|j)s?(x)'),
    ], {
      ignored: ignorePatterns,
      ignoreInitial: true,
    });

    // TODO: Do not run task if documents are not changed
    watcher.on('add', async file => {
      const documents = await loadDocumentsFromFile(file);
      documentCache.set(file, documents);
      codegenWorker.push({ documents: getDocuments() });
    });

    watcher.on('change', async file => {
      const documents = await loadDocumentsFromFile(file);
      documentCache.set(file, documents);
      codegenWorker.push({ documents: getDocuments() });
      if (insertTypeWorker) {
        insertTypeWorker.push({ file });
      }
    });

    watcher.on('unlink', file => {
      documentCache.delete(file);
      codegenWorker.push({ documents: getDocuments() });
    });
  }
};

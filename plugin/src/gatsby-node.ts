import type { GatsbyNode, Reporter } from 'gatsby';
import { interpret } from 'xstate';
import { Kind } from 'gatsby/graphql';

import type { TypegenReporter } from './internal/reporter';
import { validateConfig } from './internal/config';
import { typegenMachine } from './internal/machine';
import { makeEmitSchemaService } from './services/emitSchema';
import { makeEmitPluginDocumentService } from './services/emitPluginDocument';
import { makeAutofixService } from './services/autofix';
import { makeCodegenService } from './services/codegen';
import type { PluginOptions } from './types';
import { readFileContent, writeFileContent } from './utils';

export const pluginOptionsSchema: GatsbyNode['pluginOptionsSchema'] = ({
  Joi,
}) => {
  const documentOutputOptionsSchema = Joi.object({
    format: Joi.string()
      .valid('introspection', 'sdl')
      .default('sdl')
      .required(),
    commentDescriptions: Joi.boolean()
      .default(true),
  }).required();

  return Joi.object({
    language: Joi.string()
      .valid('typescript', 'flow')
      .default('typescript'),
    namespace: Joi.string()
      .default('GatsbyTypes'),
    outputPath: Joi.string()
      .default('src/__generated__/gatsby-types.d.ts'),
    includeResolvers: Joi.boolean()
      .default(false),
    autoFix: Joi.boolean()
      .default(true),
    scalars: Joi.object()
      .pattern(/\w[\w\d\-_]+/, Joi.string().required())
      .default({}),
    emitSchema: Joi.object()
      .pattern(/.+/, [
        Joi.boolean().required(),
        documentOutputOptionsSchema,
      ]),
    emitPluginDocuments: Joi.object()
      .pattern(/.+/, [
        Joi.boolean().required(),
        documentOutputOptionsSchema,
      ]),
    emitPluginDocument: Joi.object()
      .pattern(/.+/, [
        Joi.boolean().required(),
        documentOutputOptionsSchema,
      ]),
  });
};

let spawnedMachine: any = null;

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = ({
  store,
  emitter,
  reporter,
}, options) => {
  const typegenReporter = makeTypegenReporter(reporter);
  const pluginOptions = options as unknown as PluginOptions;

  const { program } = store.getState();
  const basePath = program.directory;

  const config = validateConfig(
    {
      basePath,
      options: pluginOptions,
      reporter: typegenReporter,
    },
  );

  typegenReporter.verbose(reporter.stripIndent`
    loaded configuration
    ${JSON.stringify(pluginOptions, null, 2)}
  `);

  const emitSchema = makeEmitSchemaService({
    configMap: config.emitSchema,
    reporter: typegenReporter,
    writeFileContent,
  });

  const emitPluginDocument = makeEmitPluginDocumentService({
    configMap: config.emitPluginDocument,
    reporter: typegenReporter,
    writeFileContent,
  });

  const autofix = makeAutofixService({
    ...config,
    readFileContent,
    writeFileContent,
  });

  const codegen = makeCodegenService({
    ...config,
    customScalars: config.scalars,
    reporter: typegenReporter,
    writeFileContent,
  })

  const typegenService = interpret(
    typegenMachine
    .withContext({
      debouncingDelay: 500,
      devMode: false,
      reporter: typegenReporter,
    })
    .withConfig({
      services: {
        emitSchema: context => emitSchema(context.schema!),
        // @ts-ignore for typegen bug
        emitPluginDocument: context => emitPluginDocument(context.thirdpartyFragments || []),
        autofix: (_context, event) => autofix(event.files),
        codegen: context => codegen({
          schema: context.schema!,
          documents: [...context.trackedDefinitions?.values() || []]
            .map(definitionMeta => ({
              document: {
                kind: Kind.DOCUMENT,
                definitions: [definitionMeta.def],
              },
              hash: definitionMeta.hash.toString(),
            })),
        }),
      },
    })
  );

  typegenService.start();

  typegenService.onTransition(({ event, value, changed }) => {
    typegenReporter.verbose(`on ${event.type}`);
    if (changed) {
      typegenReporter.verbose(` ⤷ transition to ${JSON.stringify(value)}`);
    } else {
      typegenReporter.verbose(' ⤷ skipped');
    }
  });

  spawnedMachine = typegenService;

  emitter.on('SET_SCHEMA', () => {
    typegenService.send({ type: 'SET_SCHEMA', schema: store.getState().schema });
  });

  emitter.on('SET_GRAPHQL_DEFINITIONS', () => {
    typegenService.send({ type: 'SET_GRAPHQL_DEFINITIONS', definitions: store.getState().definitions });
  });
};

export const onCreateDevServer: GatsbyNode['onCreateDevServer'] = () => {
  spawnedMachine?.send('CREATE_DEV_SERVER');
};

function makeTypegenReporter(reporter: Reporter): TypegenReporter {
  const formatMessage = (message: string) => `[typegen] ${message}`;
  return {
    ...reporter,
    log: message => reporter.log(formatMessage(message)),
    info: message => reporter.info(formatMessage(message)),
    warn: message => reporter.warn(formatMessage(message)),
    error: message => reporter.error(formatMessage(message)),
    verbose: message => reporter.verbose(formatMessage(message)),
    panic: reporter.panic,
    panicOnBuild: reporter.panicOnBuild,
  };
}

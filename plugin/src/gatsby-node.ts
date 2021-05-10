import type { GatsbyNode } from 'gatsby';
import { interpret } from 'xstate';

import type { TypegenIntepreter } from './services/typegenMachine';
import { makeTypegenMachine } from './services/typegenMachine';
import { makeEmitSchemaService } from './services/emitSchema';
import { makeEmitPluginDocumentService } from './services/emitPluginDocuments';
import type { PluginOptions } from './internal/types';
import { normalizePluginOptions } from './internal/config';

import type { GatsbyStore } from './gatsby-utils';

let service: TypegenIntepreter;

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
  });
};

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = ({
  emitter,
  store: _store,
  reporter,
}, options) => {
  const store = _store as GatsbyStore;
  const { program } = store.getState();
  const basePath = program.directory;

  const pluginOptions = normalizePluginOptions(
    options as PluginOptions,
    { store, reporter },
  );

  reporter.verbose(reporter.stripIndent`
    [typegen] loaded normalized configuration
    ${JSON.stringify(pluginOptions, null, 2)}
  `);

  const {
    emitSchema,
    emitPluginDocuments,
  } = pluginOptions;

  service = interpret(
    makeTypegenMachine({
      context: {
        schema: null,
        trackedDefinitions: null,
        thirdpartyFragmentDefinitions: [],
        reporter,
      },
      services: {
        codegen() {
          return Promise.resolve();
        },
        emitSchema: makeEmitSchemaService({
          pluginOptions,
        }),
        emitPluginDocuments: makeEmitPluginDocumentService({
          pluginOptions,
        }),
        autoFixCodes() {
          return Promise.resolve();
        },
      },
    }),
  ).start();

  service.onTransition(({ event, value, changed }) => {
    reporter.verbose(`[typegen] on ${event.type}`);
    if (changed) {
      reporter.verbose(`[typegen]  ⤷ transition to ${JSON.stringify(value)}`);
    } else {
      reporter.verbose('[typegen]  ⤷ skipped');
    }
  });

  emitter.on('SET_SCHEMA', () => {
    service.send({ type: 'SET_SCHEMA', schema: store.getState().schema });
  });

  emitter.on('SET_GRAPHQL_DEFINITIONS', () => {
    service.send({ type: 'SET_GRAPHQL_DEFINITIONS', definitions: [...store.getState().definitions.values()] });
  });
};

export const onCreateDevServer: GatsbyNode['onCreateDevServer'] = () => {
  service.send('CREATE_DEV_SERVER');
};

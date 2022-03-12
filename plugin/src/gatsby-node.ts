import type { GatsbyNode, Reporter } from 'gatsby';
import { interpret } from 'xstate';

import type { TypegenIntepreter } from './services/typegenMachine';
import { makeTypegenMachine } from './services/typegenMachine';
import { makeEmitSchemaService } from './services/emitSchema';
import { makeEmitPluginDocumentService } from './services/emitPluginDocuments';
import type { PluginOptions } from './internal/types';
import { normalizePluginOptions } from './internal/config';
import type { TypegenReporter } from './internal/reporter';

import type { GatsbyStore } from './gatsby-utils';

let service: TypegenIntepreter;

function makeTypegenReporter(reporter: Reporter): TypegenReporter {
  const prefix = '[typegen]';
  return {
    ...reporter,
    log: message => void reporter.log([prefix, message].join(' ')),
    info: message => void reporter.info([prefix, message].join(' ')),
    warn: message => void reporter.warn([prefix, message].join(' ')),
    error: message => void reporter.error([prefix, message].join(' ')),
    verbose: message => void reporter.verbose([prefix, message].join(' ')),
  };
}

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

export const onPreBootstrap: GatsbyNode['onPreBootstrap'] = ({
  emitter,
  store: _store,
  reporter: _reporter,
}, options) => {
  const store = _store as GatsbyStore;
  const reporter = makeTypegenReporter(_reporter);

  const { program } = store.getState();
  const basePath = program.directory;

  const pluginOptions = normalizePluginOptions(
    options as PluginOptions,
    { basePath, reporter },
  );

  reporter.verbose(reporter.stripIndent`
    Loaded normalized configuration
    ${JSON.stringify(pluginOptions, null, 2)}
  `);

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  service = interpret(
    makeTypegenMachine({
      context: {
        reporter,
        schema: null,
        trackedDefinitions: null,
        thirdpartyFragmentDefinitions: [],
        hasSchemaChanged: false,
        definitionChangesets: [],
      },
      services: {
        codegen() {
          return delay(1000);
        },
        emitSchema: makeEmitSchemaService({
          pluginOptions,
        }),
        emitPluginDocuments: makeEmitPluginDocumentService({
          pluginOptions,
        }),
        autoFixCodes() {
          return delay(2000);
        },
      },
    }),
  );

  service.start();

  service.onTransition(({ event, value, changed }) => {
    reporter.verbose(`on ${event.type}`);
    if (changed) {
      reporter.verbose(` ⤷ transition to ${JSON.stringify(value)}`);
    } else {
      reporter.verbose(' ⤷ skipped');
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

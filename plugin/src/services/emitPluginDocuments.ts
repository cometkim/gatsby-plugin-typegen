import type { DocumentNode } from 'gatsby/graphql';
import { Kind } from 'gatsby/graphql';
import type { NormalizedPluginOptions } from '../internal/config';
import { writeFile } from '../internal/utils';

import type { TypegenContext } from './typegenMachine';

type EmitPluginDocumentsServiceDependencies = {
  pluginOptions: NormalizedPluginOptions,
};

interface MakeEmitPluginDocumentService {
  (dependencies: EmitPluginDocumentsServiceDependencies): (ctx: TypegenContext) => Promise<void>;
}

export const makeEmitPluginDocumentService: MakeEmitPluginDocumentService = ({
  pluginOptions: {
    emitPluginDocuments,
  },
}) => {
  return async ctx => {
    if (ctx.thirdpartyFragmentDefinitions.length === 0) {
      return;
    }

    void await Promise.all(
      Object.entries(emitPluginDocuments)
      .map(([filePath, config]) => {
        ctx.reporter?.info(`emitting 3rd-party fragments into ${filePath}`);
        switch (config.format) {
          case 'graphql': {
            const printedDocument = ctx.thirdpartyFragmentDefinitions
              .map(def => def.printedAst)
              .filter(Boolean)
              .join('\n\n');
            return writeFile(filePath, printedDocument);
          }
          case 'json': {
            const document: DocumentNode = {
              kind: Kind.DOCUMENT,
              definitions: ctx.thirdpartyFragmentDefinitions.map(meta => meta.def),
            };
            return writeFile(filePath, JSON.stringify(document, null, 2));
          }
        }
      }),
    );
  };
};

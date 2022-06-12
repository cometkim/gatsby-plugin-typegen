import type { DocumentNode } from 'gatsby/graphql';
import { Kind } from 'gatsby/graphql';

import type { Config } from '../internal/config';
import type { TypegenReporter } from '../internal/reporter';
import type { IDefinitionMeta } from '../internal/utils';

interface EmitPluginDocumentService {
  (definitions: IDefinitionMeta[]): Promise<void>;
}

interface MakeEmitPluginDocumentService {
  (deps: {
    configMap: Config['emitPluginDocument'],
    reporter: TypegenReporter,
    writeFileContent: (path: string, content: string) => Promise<void>,
  }): EmitPluginDocumentService;
}

export const makeEmitPluginDocumentService: MakeEmitPluginDocumentService = ({
  configMap,
  reporter,
  writeFileContent,
}) => {
  return async definitions => {
    const entries = Object.entries(configMap);
    if (entries.length === 0) {
      return;
    }

    definitions = definitions.filter(def => def.printedAst);

    if (definitions.length === 0) {
      return;
    }

    await Promise.all(
      entries.map(async ([filePath, config]) => {
        const activity = reporter.activity(`emitting 3rd-party documents into ${filePath}`);
        activity.start();

        try {
          switch (config.format) {
            case 'graphql': {
              const printedDocument = definitions
                .map(def => def.printedAst || '')
                .filter(Boolean)
                .join('\n\n');
              await writeFileContent(filePath, printedDocument);
            }
            case 'json': {
              const document: DocumentNode = {
                kind: Kind.DOCUMENT,
                definitions: definitions.map(meta => meta.def),
              };
              await writeFileContent(filePath, JSON.stringify(document, null, 2));
            }
          }
        } catch (e) {
          activity.panic(e);
        } finally {
          activity.end();
        }
      }),
    );
  };
};

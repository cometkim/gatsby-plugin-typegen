import fs from 'fs';
import { dirname } from 'path';
import { promisify } from 'util';
import { Source } from '@graphql-toolkit/common';

const _mkdir = promisify(fs.mkdir);
const _readFile = promisify(fs.readFile);
const _writeFile = promisify(fs.writeFile);

export const readFile = async (path: string) => _readFile(path, { encoding: 'utf-8' });
export const writeFile = async (path: string, data: string | Buffer) => {
  await _mkdir(dirname(path), { recursive: true });
  await _writeFile(path, data, { encoding: 'utf-8' });
};

export const delay = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

export const formatLanguage = (lang: 'typescript' | 'flow') => (
  (lang === 'typescript') ? 'TypeScript' : 'Flow'
);

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

export function deduplicateFragmentFromDocuments(documents: Source[]) {
  const existFragmentNames = new Set<string>();
  return documents.map(source => {
    const { document } = source;

    // Nothing to do for other sources
    if (!document) {
      return source;
    }

    const uniqDefinitions = document.definitions.filter(def => {
      // De-dup only cares about fragments
      if (def.kind !== 'FragmentDefinition') {
        return true;
      }
      const fragmentName = def.name.value;
      const duplicated = existFragmentNames.has(fragmentName);
      if (!duplicated) existFragmentNames.add(fragmentName);
      return !duplicated;
    });

    return {
      ...source,
      document: {
        ...document,
        definitions: uniqDefinitions,
      },
    };
  });
}

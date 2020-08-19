import type { Source } from '@graphql-toolkit/common';

import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { visit } from 'graphql';
import { deduplicateFragmentFromDocuments } from '../src/common';

const readFile = promisify(fs.readFile);

test('deduplicateFragmentFromDocuments()', async () => {
  const data = await readFile(path.resolve(__dirname, 'data/gh-33.json'), 'utf-8');
  const documents = JSON.parse(data) as Source[];
  const resultDocuments = deduplicateFragmentFromDocuments(documents);

  const fragmentNames = new Set<string>();
  for (const { document } of resultDocuments) {
    if (!document) continue;
    visit(document, {
      FragmentDefinition(node) {
        const duplicated = fragmentNames.has(node.name.value);
        expect(duplicated).toBe(false);

        if (!duplicated) {
          fragmentNames.add(node.name.value);
        }
      },
    });
  }
});

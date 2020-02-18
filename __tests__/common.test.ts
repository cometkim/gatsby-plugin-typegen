import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { visit } from 'graphql';
import { deduplicateFragmentFromDocuments } from '../src/common';

const readFile = promisify(fs.readFile);

test('deduplicateFragmentFromDocuments()', async () => {
  const data = await readFile(path.resolve(__dirname, 'data/gh-33.json'), 'utf-8');
  const documents = JSON.parse(data);
  const resultDocuments = deduplicateFragmentFromDocuments(documents);

  const fragmentNames = new Set<string>();
  for (const { document } of resultDocuments) {
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

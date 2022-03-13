import { dirname } from 'path';
import * as fs from 'fs';

export const readFileContent = async (path: string): Promise<string> => {
  return fs.promises.readFile(path, 'utf-8');
};

export const writeFileContent = async (path: string, content: string): Promise<void> => {
  await fs.promises.mkdir(dirname(path), { recursive: true });
  await fs.promises.writeFile(path, content, 'utf-8');
};



import fs from 'fs';
import { dirname } from 'path';
import { promisify } from 'util';
import type { Store } from 'redux';
import type {
  IGatsbyState as GatsbyState,
  ActionsUnion as GatsbyAction,
  IDefinitionMeta as _IDefinitionMeta,
} from 'gatsby/dist/redux/types';
import type { OverrideProps } from '@cometjs/core';

type Brand<T extends string> = { __BRAND__: T };

const _mkdir = promisify(fs.mkdir);
const _readFile = promisify(fs.readFile);
const _writeFile = promisify(fs.writeFile);

export const readFile = async (path: string): Promise<string> => {
  return _readFile(path, { encoding: 'utf-8' });
};

export const writeFile = async (path: string, data: string | Buffer): Promise<void> => {
  await _mkdir(dirname(path), { recursive: true });
  await _writeFile(path, data, { encoding: 'utf-8' });
};

export const delay = (ms: number): Promise<void> => new Promise<void>(res => setTimeout(res, ms));

export const formatLanguage = (lang: 'typescript' | 'flow'): 'TypeScript' | 'Flow' => (
  (lang === 'typescript') ? 'TypeScript' : 'Flow'
);

export type GatsbyStore = Store<GatsbyState, GatsbyAction>;

export type IDefinitionMeta = OverrideProps<_IDefinitionMeta, {
  // Trust me, this is more accurate.
  printedAst: string | null,
}>;

export type FragmentDefinition = OverrideProps<IDefinitionMeta, {
  isFragment: true,
}> & Brand<'FragmentDefinition'>;

export type QueryDefinition = OverrideProps<IDefinitionMeta, {
  isFragment: false,
}> & Brand<'QueryDefinition'>;

export function isFragmentDefinition(def: IDefinitionMeta): def is FragmentDefinition {
  return def.isFragment;
}

export function isQueryDefinition(def: IDefinitionMeta): def is QueryDefinition {
  return !def.isFragment;
}

/**
 * return `true` if the given definition is assumed to be generated from unnamed query.
 */
export function guessIfUnnnamedQuery(def: QueryDefinition): boolean {
  const { name, filePath } = def;
  const baseDir = dirname(filePath);
  return name.startsWith(baseDir.split('/').join(''));
}

export function guessIfThirdPartyDefinition(def: IDefinitionMeta): boolean {
  const { filePath } = def;
  return /(node_modules|\.yarn|\.cache)/.test(filePath);
}

// from https://github.com/gatsbyjs/gatsby/blob/6b4b7f81ec/packages/gatsby/src/schema/print.js#L33-L48
export const gatsbyInternalScalars = [
  'Boolean',
  'Buffer',
  'Date',
  'Float',
  'ID',
  'Int',
  'Internal',
  'InternalInput',
  'JSON',
  'Json',
  'Node',
  'NodeInput',
  'Query',
  'String',
];

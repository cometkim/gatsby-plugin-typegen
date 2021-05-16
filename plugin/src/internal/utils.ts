import fs from 'fs';
import { dirname } from 'path';
import { promisify } from 'util';
import type { Store } from 'redux';
import type {
  IGatsbyState,
  ActionsUnion,
  IDefinitionMeta as _IDefinitionMeta,
} from 'gatsby/dist/redux/types';
import type { OverrideProps } from '@cometjs/core';

import type { SupportedLanguage } from './types';

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

export const formatLanguage = (lang: SupportedLanguage): string => (
  (lang === 'typescript') ? 'TypeScript' : 'Flow'
);

export type GatsbyStore = Store<IGatsbyState, ActionsUnion>;

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
export function guessIfUnnnamedQuery({ name, filePath }: IDefinitionMeta): boolean {
  const baseDir = dirname(filePath);
  return name.startsWith(baseDir.split('/').join(''));
}

export function guessIfThirdPartyDefinition({ filePath }: IDefinitionMeta): boolean {
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

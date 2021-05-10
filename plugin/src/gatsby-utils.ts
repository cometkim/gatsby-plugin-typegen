import path from 'path';
import type { Store } from 'redux';
import type {
  IGatsbyState as GatsbyState,
  ActionsUnion as GatsbyAction,
  IDefinitionMeta as _IDefinitionMeta,
} from 'gatsby/dist/redux/types';
import type { OverrideProps } from '@cometjs/core';

export type GatsbyStore = Store<GatsbyState, GatsbyAction>;

export type IDefinitionMeta = OverrideProps<_IDefinitionMeta, {
  // Trust me, this is more accurate.
  printedAst: string | null,
}>;
export type FragmentDefinition = OverrideProps<IDefinitionMeta, {
  __BRAND__: 'FragmentDefinition',
  isFragment: true,
}>;
export type QueryDefinition = OverrideProps<IDefinitionMeta, {
  __BRAND__: 'QueryDefinition', isFragment: false,
}>;

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
  const baseDir = path.dirname(filePath);
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

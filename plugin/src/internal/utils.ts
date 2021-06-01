import fs from 'fs';
import { dirname } from 'path';
import { promisify } from 'util';
import type { Store } from 'redux';
import { GraphQLEnumType, GraphQLSchema } from 'gatsby/graphql';
import type {
  IGatsbyState,
  ActionsUnion,
  IDefinitionMeta as _IDefinitionMeta,
} from 'gatsby/dist/redux/types';
import type { OverrideProps } from '@cometjs/core';
import {
  filterSchema,
  mapSchema,
  MapperKind,
} from '@graphql-tools/utils';

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

function filterByCoordinates(
  denylist: string[],
  coord: { typeName?: string, fieldName?: string, argName?: string },
) {
  const coordStr = [coord.typeName, coord.fieldName, coord.argName]
    .filter(Boolean)
    .join('.');
  return !denylist.includes(coordStr);
}

/**
 * Remove specific types and fields used only at development time from schema output.
 */
export function filterDevOnlySchema(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(filterSchema({
    schema,
    fieldFilter: (typeName, fieldName) => filterByCoordinates([
      'Site.host',
      'Site.port',
      'SiteFilterInput.host',
      'SiteFilterInput.port',
    ], { typeName, fieldName }),
    argumentFilter: (typeName, fieldName, argName) => filterByCoordinates([
      'Query.site.host',
      'Query.site.port',
    ], { typeName, fieldName, argName }),
  }), {
    [MapperKind.ENUM_TYPE]: type => {
      if (type.name === 'SiteFieldsEnum') {
        const config = type.toConfig();
        delete config.values['host'];
        delete config.values['port'];
        return new GraphQLEnumType({ ...config });
      }
      return undefined;
    },
  });
}

/**
 * Remove the plugin options schema.
 * Almost all users do not use it, but it unnecessarily increases the schema output size.
 */
export function filterPluginSchema(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(filterSchema({
    schema,
    typeFilter: typeName => !typeName.startsWith('SitePlugin'),
    fieldFilter: (typeName, fieldName) => filterByCoordinates([
      'Query.allSitePlugin',
      'Query.sitePlugin',
      'SitePage.pluginCreatorId',
    ], { typeName, fieldName }),
    inputObjectFieldFilter: (typeName, fieldName) => filterByCoordinates([
      'SitePageFilterInput.pluginCreator',
      'SitePageFilterInput.pluginCreatorId',
    ], { typeName, fieldName }),
    argumentFilter: (typeName, fieldName, argName) => filterByCoordinates([
      'Query.sitePage.pluginCreator',
      'Query.sitePage.pluginCreatorId',
    ], { typeName, fieldName, argName }),
  }), {
    [MapperKind.ENUM_TYPE]: type => {
      if (type.name === 'SitePageFieldsEnum') {
        const config = type.toConfig();
        for (const key of Object.keys(config.values)) {
          if (key.startsWith('pluginCreator')) {
            delete config.values[key];
          }
        }
        return new GraphQLEnumType({ ...config });
      }
      return undefined;
    },
  });
}

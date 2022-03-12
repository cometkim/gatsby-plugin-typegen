import * as fs from 'fs';
import { dirname } from 'path';
import type { GraphQLSchema } from 'gatsby/graphql';
import { GraphQLEnumType } from 'gatsby/graphql';
import type { IDefinitionMeta as _IDefinitionMeta } from 'gatsby/dist/redux/types';
import {
  filterSchema,
  mapSchema,
  MapperKind,
} from '@graphql-tools/utils';

import type { SupportedLanguage } from './options';

type OverrideProps<TBaseProps, TNewProps> = Omit<TBaseProps, keyof TNewProps> & TNewProps;

type Brand<TAG extends string, T> = T & { __TAG__: TAG };

export const readFileContent = async (path: string): Promise<string> => {
  return fs.promises.readFile(path, { encoding: 'utf-8' });
};

export const writeFileContent = async (path: string, data: string | Buffer): Promise<void> => {
  await fs.promises.mkdir(dirname(path), { recursive: true });
  await fs.promises.writeFile(path, data, { encoding: 'utf-8' });
};

export const formatLanguage = (lang: SupportedLanguage): string => (
  (lang === 'typescript') ? 'TypeScript' : 'Flow'
);

export type IDefinitionMeta = OverrideProps<_IDefinitionMeta, {
  // Trust me, this is more accurate.
  printedAst: string | null,
}>;

export type FragmentDefinition = Brand<
  'FragmentDefinition',
  OverrideProps<IDefinitionMeta, {
    isFragment: true,
  }>
>;

export type QueryDefinition = Brand<
  'QueryDefinition',
  OverrideProps<IDefinitionMeta, {
    isFragment: false,
  }>
>;

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

/**
 * return `true` if the given definition is assumed to be included by third-party plugins or gatsby internal.
 */
export function guessIfThirdpartyDefinition({ filePath }: IDefinitionMeta): boolean {
  return /(node_modules|\.yarn|\.cache)/.test(filePath);
}

// from https://github.com/gatsbyjs/gatsby/blob/6365768/packages/gatsby/src/schema/print.js#L33-L48
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

const filterFromCoordinates = (
  (coords: string[]) =>
  (coord: { typeName?: string, fieldName?: string, argName?: string }) =>
  {
    const target = [coord.typeName, coord.fieldName, coord.argName]
      .filter(Boolean)
      .join('.');
    return !coords.includes(target);
  }
);

/**
 * Remove fields and args used only at development time from schema output.
 */
export function filterDevOnlySchema(schema: GraphQLSchema): GraphQLSchema {
  return mapSchema(filterSchema({
    schema,
    fieldFilter: (typeName, fieldName) => (
      filterFromCoordinates([
        'Site.host',
        'Site.port',
        'SiteFilterInput.host',
        'SiteFilterInput.port',
      ])({ typeName, fieldName })
    ),
    argumentFilter: (typeName, fieldName, argName) => (
      filterFromCoordinates([
        'Query.site.host',
        'Query.site.port',
      ])({ typeName, fieldName, argName })
    ),
  }), {
    [MapperKind.ENUM_TYPE]: type => {
      if (type.name === 'SiteFieldsEnum') {
        const config = type.toConfig();
        delete config.values['host'];
        delete config.values['port'];
        return new GraphQLEnumType(config);
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
    fieldFilter: (typeName, fieldName) => (
      filterFromCoordinates([
        'Query.allSitePlugin',
        'Query.sitePlugin',
        'SitePage.pluginCreatorId',
      ])({ typeName, fieldName })
    ),
    inputObjectFieldFilter: (typeName, fieldName) => (
      filterFromCoordinates([
        'SitePageFilterInput.pluginCreator',
        'SitePageFilterInput.pluginCreatorId',
      ])({ typeName, fieldName })
    ),
    argumentFilter: (typeName, fieldName, argName) => (
      filterFromCoordinates([
        'Query.sitePage.pluginCreator',
        'Query.sitePage.pluginCreatorId',
      ])({ typeName, fieldName, argName })
    ),
  }), {
    [MapperKind.ENUM_TYPE]: type => {
      if (type.name === 'SitePageFieldsEnum') {
        const config = type.toConfig();
        for (const key of Object.keys(config.values)) {
          if (key.startsWith('pluginCreator')) {
            delete config.values[key];
          }
        }
        return new GraphQLEnumType(config);
      }
      return undefined;
    },
  });
}

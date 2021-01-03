import slugify from 'slugify';
import _ from 'lodash';
import type { GraphQLSchema, SourceLocation } from 'gatsby/graphql';
import { GraphQLEnumType, lexicographicSortSchema } from 'gatsby/graphql';
import type { IDefinitionMeta as _IDefinitionMeta } from 'gatsby/dist/redux/types';
import {
  filterSchema,
  mapSchema,
  MapperKind,
} from '@graphql-tools/utils';

import type { SupportedLanguage } from './pluginOptions';

export type OverrideProps<TBaseProps, TNewProps> = Omit<TBaseProps, keyof TNewProps> & TNewProps;

export type Brand<TAG extends string, T> = T & { __TAG__: TAG };

export const formatLanguage = (lang: SupportedLanguage): string => (
  (lang === 'typescript') ? 'TypeScript' : 'Flow'
);

export type IDefinitionMeta = OverrideProps<_IDefinitionMeta, {
  templateLoc: SourceLocation,

  // Trust me, this is more accurate.
  printedAst: string | null,

  // https://github.com/gatsbyjs/gatsby/blob/d163724/packages/gatsby/src/query/file-parser.js#L429
  isConfigQuery: boolean,

  hash: number,
}>;

export function definitionIsEqual(a: IDefinitionMeta, b: IDefinitionMeta): boolean {
  return a.name === b.name && a.hash === b.hash;
}

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
function guessIfUnnnamedQuery({ isStaticQuery, name, filePath }: IDefinitionMeta): boolean {
  const queryType = isStaticQuery ? 'static' : 'page';
  // See https://github.com/gatsbyjs/gatsby/blob/d163724/packages/gatsby/src/query/file-parser.js#L33
  const generatedQueryName = slugify(filePath, { replacement: ' ', lower: false });
  const pattern = _.camelCase(`${queryType}-${generatedQueryName}`);
  return name.startsWith(pattern);
}

/**
 * return `true` if the given definition is assumed to be included by third-party plugins or gatsby internal.
 */
function guessIfThirdpartyDefinition({ filePath }: IDefinitionMeta): boolean {
  return /(node_modules|\.yarn|\.cache)/.test(filePath);
}

export function isThirdpartyFragment(def: IDefinitionMeta): def is FragmentDefinition {
  return isFragmentDefinition(def) && guessIfThirdpartyDefinition(def);
}

export function isTargetDefinition(def: IDefinitionMeta): boolean {
  return !(guessIfThirdpartyDefinition(def) || guessIfUnnnamedQuery(def));
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

const fieldFilterFromCoordinates = (
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
      fieldFilterFromCoordinates([
        'Site.host',
        'Site.port',
        'SiteFilterInput.host',
        'SiteFilterInput.port',
      ])({ typeName, fieldName })
    ),
    argumentFilter: (typeName, fieldName, argName) => (
      fieldFilterFromCoordinates([
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
      fieldFilterFromCoordinates([
        'Query.allSitePlugin',
        'Query.sitePlugin',
        'SitePage.pluginCreatorId',
      ])({ typeName, fieldName })
    ),
    inputObjectFieldFilter: (typeName, fieldName) => (
      fieldFilterFromCoordinates([
        'SitePageFilterInput.pluginCreator',
        'SitePageFilterInput.pluginCreatorId',
      ])({ typeName, fieldName })
    ),
    argumentFilter: (typeName, fieldName, argName) => (
      fieldFilterFromCoordinates([
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

export function stabilizeSchema(schema: GraphQLSchema): GraphQLSchema {
  return lexicographicSortSchema(filterDevOnlySchema(schema));
}

export function sortDefinitions(a: IDefinitionMeta, b: IDefinitionMeta): number {
  const aKey = a.name;
  const bKey = b.name;
  if (aKey < bKey) {
    return -1;
  }
  if (aKey > bKey) {
    return 1;
  }
  return 0;
}

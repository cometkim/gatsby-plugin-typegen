import { stripIndent } from 'common-tags';
import { print, parse } from 'gatsby/graphql';
import { readFile } from './common';

const prettifySDL = (value: string) => print(parse(value, { noLocation: true }));

/**
 * @param componentPath path of file to extract static and page queries
 */
export const extractDocuments = (content: string) => {
  return {
    staticQueryComponents: extractStaticQueryComponentDocuments(content),
    staticQueryHooks: extractStaticQueryHookDocuments(content),
    pageQueries: extractPageQueryDocuments(content),
  };
};

/**
 * @param componentPath path of file to get all documents
 */
export const parseFile = async (componentPath: string) => {
  const file = await readFile(componentPath);
  const {
    staticQueryComponents,
    staticQueryHooks,
    pageQueries,
  } = extractDocuments(file);

  if ([
    staticQueryComponents.length === 0,
    staticQueryHooks.length === 0,
    pageQueries.length === 0,
  ].every(Boolean)) {
    return null;
  }

  return staticQueryComponents.join('\n')
    + staticQueryHooks.join('\n')
    + pageQueries.join('\n')
  ;
};

/**
 * Component-style static queries should be:
 * - use Gatsby's StaticQuery component API
 * - use Gatsby's graphql tagged template literal
 *
 * (?<JsxTagOpening><StaticQuery
 *   (?<TagTypeTemplate><
 *     (?<TagTypeArgument>\S+)
 *   >)?
 * )
 * [\s\S]+?
 * query={
 * [\s\S]*?
 * graphql
 * (?<TemplateLiteral>`\s*
 *   (?<QueryDefinitionStart>
 *     query\s+(?<QueryName>\S*)
 *     \s*\{
 *   )
 *   [^`]*?
 * `)
 */
const STATIC_QUERY_COMPONENT_REGEXP = /(?<JsxTagOpening><StaticQuery(?<TagTypeTemplate><(?<TagTypeArgument>\S+)>)?)[\s\S]+?query={[\s\S]*?graphql(?<TemplateLiteral>`\s*(?<QueryDefinition>(?<QueryDefinitionStart>query\s+(?<QueryName>\S*)\s*\{)[^`]*)`)/g;


export const extractStaticQueryComponentDocuments = (content: string): string[] => {
  const result: string[] = [];

  let match: RegExpExecArray | null = null;
  while(match = STATIC_QUERY_COMPONENT_REGEXP.exec(content)) {
    if (!(match && match.groups)) {
      continue;
    }
    let rawSDL = match.groups['QueryDefinition'];
    try {
      rawSDL = prettifySDL(rawSDL);
    } catch { /* drop error */ }
    result.push(rawSDL);
    break;
  }

  return result;
};

/**
 * Hook-style static queries should be:
 * - use Gatsby's useStaticQuery hook API
 * - use Gatsby's graphql tagged template literal
 *
 * (?<CallExpressionName>useStaticQuery
 *   (?<TypeTemplate><
 *     (?<TypeArgument>\S*)
 *   >)?
 * )
 * \([\s\S]*?
 * graphql
 * (?<TemplateLiteral>`\s*
 *   (?<QueryDefinition>
 *     (?<QueryDefinitionStart>
 *       query\s+(?<QueryName>\S*)
 *       \s*\{
 *     )
 *     [^`]*
 *   )
 * `)
 */
const STATIC_QUERY_HOOK_REGEXP = /(?<CallExpressionName>useStaticQuery(?<TypeTemplate><(?<TypeArgument>\S*)>)?)\([\s\S]*?graphql(?<TemplateLiteral>`\s*(?<QueryDefinition>(?<QueryDefinitionStart>query\s+(?<QueryName>\S*)\s*\{)[^`]*)`)/g;

export const extractStaticQueryHookDocuments = (content: string) => {
  const result: string[] = [];

  let match: RegExpExecArray | null = null;
  while(match = STATIC_QUERY_HOOK_REGEXP.exec(content)) {
    if (!(match && match.groups)) {
      continue;
    }
    let rawSDL = match.groups['QueryDefinition'];
    try {
      rawSDL = prettifySDL(rawSDL);
      result.push(rawSDL);
    } catch { /* drop error */ }
  }

  return result;
};

/**
 * Page queries should be:
 * - valid var|let|const binding
 * - exported
 * - use Gatsby's graphql tagged template literal
 * - only a single page query allowed (use first one)
 *
 * export
 * \s+
 * (var|let|const)
 * \s+
 * (?<VariableName>\S+)
 * \s*
 * =
 * \s*
 * graphql
 * (?<TemplateLiteral>`\s*
 *   (?<QueryDefinitionStart>
 *     query\s+(?<QueryName>\S*)
 *     \s*\{
 *   )
 *   [^`]*?
 * `)
 */
const PAGE_QUERY_REGEXP = /export\s+(var|let|const)\s+(?<VariableName>\S+)\s*=\s*graphql(?<TemplateLiteral>`\s*(?<QueryDefinition>(?<QueryDefinitionStart>query\s+(?<QueryName>\S*)\s*\{)[^`]*)`)/;

export const extractPageQueryDocuments = (content: string) => {
  const result: string[] = [];

  let match = PAGE_QUERY_REGEXP.exec(content);
  if (!(match && match.groups)) {
    return result;
  }
  let rawSDL = match.groups['QueryDefinition'];
  try {
    rawSDL = prettifySDL(rawSDL);
    result.push(rawSDL);
  } catch { /* drop error */ }

  return result;
};

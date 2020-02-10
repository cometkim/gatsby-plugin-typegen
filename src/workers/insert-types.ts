import { Reporter } from 'gatsby';
import { queue, AsyncQueue, asyncify } from 'async';

import { readFile, writeFile } from '../common';

const CONCURRENCY = 2;

/**
 * (?<CallExpressionName>useStaticQuery
 *   (?<TypeTemplate><
 *     (?<TypeArgument>\S*)
 *   >)?
 * )
 * \([\s\S]*?
 * graphql
 * (?<TemplateLiteral>`\s*?
 *   (?<QueryDefinitionStart>query
 *     (?<QueryName>\S*)
 *     [^{]?\{
 *   )
 *   [^`]*?
 * `)
 */
const STATIC_QUERY_HOOK_REGEXP = /(?<CallExpressionName>useStaticQuery(?<TypeTemplate><(?<TypeArgument>\S*)>)?)\([\s\S]*?graphql(?<TemplateLiteral>`\s*?(?<QueryDefinitionStart>query (?<QueryName>\S*)[^{]{)[^`]*?`)/g
const STATIC_QUERY_HOOK_REPLACER = (substring: string, ...args: any[]): string => {
  const { length: l, [l - 1]: groups } = args;
  return substring.replace(groups['CallExpressionName'], `useStaticQuery<${groups['QueryName']}Query>`);
}

/**
 * (?<JsxTagOpening><StaticQuery
 *   (?<TagTypeTemplate><
 *     (?<TagTypeArgument>\S+)
 *   >)?
 * )
 * [\s\S]+?
 * query={
 * [\s\S]*?
 * graphql
 * (?<TemplateLiteral>`\s*?
 *   (?<QueryDefinitionStart>query
 *     (?<QueryName>\S*)
 *     [^{]?\{
 *   )
 *   [^`]*?
 * `)
 */
const STATIC_QUERY_COMPONENT_REGEXP = /(?<JsxTagOpening><StaticQuery(?<TagTypeTemplate><(?<TagTypeArgument>\S+)>)?)[\s\S]+?query={[\s\S]*?graphql(?<TemplateLiteral>`\s*?(?<QueryDefinitionStart>query (?<QueryName>\S*)[^{]?\{)[^`]*`)/g
const STATIC_QUERY_COMPONENT_REPLACER = (substring: string, ...args: any[]): string => {
  const { length: l, [l - 1]: groups } = args;
  return substring.replace(groups['JsxTagOpening'], `<StaticQuery<${groups['QueryName']}Query>`);
}

type InsertTypeTaskPayload = {
  file: string,
};
type InsertTypeWorker = AsyncQueue<InsertTypeTaskPayload>;
interface SetupInsertTypeWorkerFn {
  (props: {
    reporter: Reporter,
  }): InsertTypeWorker;
}
export const setupInsertTypeWorker: SetupInsertTypeWorkerFn = ({
  reporter,
}) => {
  const worker = queue<InsertTypeTaskPayload>(asyncify(async (task: InsertTypeTaskPayload) => {
    const { file } = task;

    const content = await readFile(file);
    const fixed = content
      .replace(STATIC_QUERY_HOOK_REGEXP, STATIC_QUERY_HOOK_REPLACER)
      .replace(STATIC_QUERY_COMPONENT_REGEXP, STATIC_QUERY_COMPONENT_REPLACER)

    if (content.length !== fixed.length) {
      reporter.verbose(`[typegen] Insert type definitions to ${file}`);
      await writeFile(file, fixed);
    }
  }), CONCURRENCY);

  return worker;
};

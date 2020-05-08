import type { Reporter } from 'gatsby';
import type { AsyncQueue } from 'async';
import type { RequiredPluginOptions } from '../plugin-utils';

import { queue, asyncify } from 'async';
import { readFile, writeFile } from '../common';

const CONCURRENCY = 4;

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
const STATIC_QUERY_HOOK_REGEXP = /(?<CallExpressionName>useStaticQuery(?<TypeTemplate><(?<TypeArgument>\S*)>)?)\([\s\S]*?graphql(?<TemplateLiteral>`\s*?(?<QueryDefinitionStart>query (?<QueryName>\S*)[^{]{)[^`]*?`)/g;

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
const STATIC_QUERY_COMPONENT_REGEXP = /(?<JsxTagOpening><StaticQuery(?<TagTypeTemplate><(?<TagTypeArgument>\S+)>)?)[\s\S]+?query={[\s\S]*?graphql(?<TemplateLiteral>`\s*?(?<QueryDefinitionStart>query (?<QueryName>\S*)[^{]?\{)[^`]*`)/g;

export type InsertTypeTask = {
  file: string,
};

export type InsertTypeWorker = AsyncQueue<InsertTypeTask>;

interface SetupInsertTypeWorkerFn {
  (props: {
    reporter: Reporter,
    language: RequiredPluginOptions['language'],
    namespace: string,
  }): InsertTypeWorker;
}
export const setupInsertTypeWorker: SetupInsertTypeWorkerFn = ({
  reporter,
  language,
  namespace,
}) => {
  const worker = queue<InsertTypeTask>(asyncify(async (task: InsertTypeTask) => {
    const { file } = task;
    const accessor = language === 'typescript' ? '.' : '$';

    const content = await readFile(file);
    const fixed = content
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .replace(STATIC_QUERY_HOOK_REGEXP, (substring: string, ...args: any[]): string => {
        const { length: l, [l - 1]: groups } = args;
        return substring.replace(groups['CallExpressionName'], `useStaticQuery<${namespace}${accessor}${groups['QueryName']}Query>`);
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .replace(STATIC_QUERY_COMPONENT_REGEXP, (substring: string, ...args: any[]): string => {
        const { length: l, [l - 1]: groups } = args;
        return substring.replace(groups['JsxTagOpening'], `<StaticQuery<${namespace}${accessor}${groups['QueryName']}Query>`);
      });

    if (content !== fixed) {
      reporter.verbose(`[typegen] Insert type definitions into ${file}\nbecause documents were changed.`);
      await writeFile(file, fixed);
    }
  }), CONCURRENCY);

  return worker;
};

import path from 'path';
import { Option } from '@cometjs/core';
import { readFile, writeFile } from '../../common';

import type { AutoFixContext } from './types';

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

interface FixCodeFn {
  (args: {
    code: string,
    namespace: string,
  }): string;
}
const fixTypeScript: FixCodeFn = ({ code, namespace }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return code
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .replace(STATIC_QUERY_HOOK_REGEXP, (substring: string, ...args: any[]) => {
      const { length: l, [l - 1]: groups } = args;
      return substring.replace(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        groups['CallExpressionName'],
        // eslint-disable-next-line
        `useStaticQuery<${namespace}.${groups['QueryName']}Query>`,
      );
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .replace(STATIC_QUERY_COMPONENT_REGEXP, (substring: string, ...args: any[]) => {
      const { length: l, [l - 1]: groups } = args;
      return substring.replace(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        groups['JsxTagOpening'],
        // eslint-disable-next-line
        `<StaticQuery<${namespace}.${groups['QueryName']}Query>`,
      );
    });
};
const fixFlow: FixCodeFn = ({ code, namespace }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return code
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .replace(STATIC_QUERY_HOOK_REGEXP, (substring: string, ...args: any[]) => {
      const { length: l, [l - 1]: groups } = args;
      return substring.replace(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        groups['CallExpressionName'],
        // eslint-disable-next-line
        `useStaticQuery<${namespace}$${groups['QueryName']}Query>`,
      );
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .replace(STATIC_QUERY_COMPONENT_REGEXP, (substring: string, ...args: any[]) => {
      const { length: l, [l - 1]: groups } = args;
      return substring.replace(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        groups['JsxTagOpening'],
        // eslint-disable-next-line
        `<StaticQuery<${namespace}$${groups['QueryName']}Query>`,
      );
    });
};

const lookupFirstComment = (code: string) => {
  const result = /(\/\/(.*)|\/\*([\s\S]*)\*\/)/.exec(code);
  return Option.map(result, ([match]) => match);
};

const hasFlowComment = (code: string) => {
  const firstComment = lookupFirstComment(code);
  return Option.map(firstComment, {
    Some: true,
    None: false,
  });
};

const isJavaScriptFile = (file: string): boolean => {
  const ext = path.extname(file);
  return /jsx?/.test(ext);
};

const isTypeScriptFile = (file: string): boolean => {
  const ext = path.extname(file);
  return /tsx?/.test(ext);
};

interface AutoFixFileFn {
  (args: {
    file: string,
    namespace: string,
  }): Promise<void>;
}

const autoFixTypeScriptFile: AutoFixFileFn = async ({ file, namespace }) => {
  const code = await readFile(file);
  const fixed = fixTypeScript({ code, namespace });
  if (code !== fixed) {
    await writeFile(file, fixed);
  }
};

const autoFixFlowFile: AutoFixFileFn = async ({ file, namespace }) => {
  const code = await readFile(file);
  if (!hasFlowComment(code)) {
    return;
  }

  const fixed = fixFlow({ code, namespace });
  if (code !== fixed) {
    await writeFile(file, fixed);
  }
};

interface AutoFixFilesFn {
  (ctx: AutoFixContext): Promise<Array<PromiseSettledResult<void>>>;
}

export const autoFixTypeScriptFiles: AutoFixFilesFn = ({
  files,
  pluginOptions: {
    namespace,
  },
}) => {
  return Promise.allSettled(
    files
    .filter(isTypeScriptFile)
    .map(file => autoFixTypeScriptFile({ file, namespace })),
  );
};

export const autoFixFiles = ({
  files,
  pluginOptions: {
    language,
    namespace,
  },
}: AutoFixContext): Promise<Array<PromiseSettledResult<void>>> => {
  if (language === 'typescript') {
    return Promise.allSettled(
      files
      .filter(isTypeScriptFile)
      .map(file => autoFixTypeScriptFile({ file, namespace })),
    );
  } else {
    return Promise.allSettled(
      files
      .filter(isJavaScriptFile)
      .map(file => autoFixFlowFile({ file, namespace })),
    );
  }
};

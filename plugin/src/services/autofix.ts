import * as path from 'path';

import type { Config } from '../internal/config';
import type { TypegenReporter } from '../internal/reporter';
import { formatLanguage } from '../internal/utils';

interface AutofixService {
  (files: string[]): Promise<void>;
}

interface MakeAutofixService {
  (deps: {
    readFileContent: (path: string) => Promise<string>,
    writeFileContent: (path: string, content: string) => Promise<void>,
    language: Config['language'],
    namespace: Config['namespace'],
    reporter: TypegenReporter,
  }): AutofixService;
}

export { makeAutofixService };

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
  return result?.[0];
};

const hasFlowComment = (code: string) => {
  const firstComment = lookupFirstComment(code);
  return Boolean(firstComment);
};

const isJavaScriptFile = (file: string): boolean => {
  const ext = path.extname(file);
  return /jsx?/.test(ext);
};

const isTypeScriptFile = (file: string): boolean => {
  const ext = path.extname(file);
  return /tsx?/.test(ext);
};

interface AutofixFn {
  (args: {
    namespace: string,
    filePath: string,
    readFileContent: (path: string) => Promise<string>,
    writeFileContent: (path: string, content: string) => Promise<void>,
  }): Promise<string | null>;
}

const autofixTypeScriptFile: AutofixFn = async ({
  namespace,
  filePath,
  readFileContent,
  writeFileContent,
}) => {
  const code = await readFileContent(filePath);
  const fixed = fixTypeScript({ code, namespace });
  if (code !== fixed) {
    await writeFileContent(filePath, fixed);
    return filePath;
  }
  return null;
};

const autofixFlowFile: AutofixFn = async ({
  namespace,
  filePath,
  readFileContent,
  writeFileContent,
}) => {
  const code = await readFileContent(filePath);
  if (!hasFlowComment(code)) {
    return null;
  }

  const fixed = fixFlow({ code, namespace });
  if (code !== fixed) {
    await writeFileContent(filePath, fixed);
    return filePath;
  }
  return null;
};

const makeAutofixService: MakeAutofixService = ({
  namespace,
  language,
  readFileContent,
  writeFileContent,
  reporter,
}) => async files => {
  const progress = reporter.progress(
    `autofix ${files.length} files (language: ${formatLanguage(language)})`,
    files.length,
  );

  if (language === 'typescript') {
    await Promise.allSettled(
      files
      .filter(isTypeScriptFile)
      .map(async filePath => {
        try {
          await autofixTypeScriptFile({
            filePath,
            namespace,
            readFileContent,
            writeFileContent,
          });
        } catch (e) {
          reporter.error(`failed to autofix ${filePath}`, e as Error);
        } finally {
          progress.tick();
        }
      }),
    );
  } else {
    await Promise.allSettled(
      files
      .filter(isJavaScriptFile)
      .map(async filePath => {
        try {
          await autofixFlowFile({
            filePath,
            namespace,
            readFileContent,
            writeFileContent,
          });
        } catch (e) {
          reporter.error(`failed to autofix ${filePath}`, e as Error);
        } finally {
          progress.tick();
        }
      }),
    );
  }

  progress.done();
};

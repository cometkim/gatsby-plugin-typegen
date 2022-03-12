import { when } from 'jest-when';
import { stripIndent } from 'common-tags';

import { makeAutofixService } from '../src/services/autofix';

describe('autofix service', () => {
  it('should insert type argument automatically for TypeScript files', async () => {
    const readFileContent = jest.fn<Promise<string>, [string]>();
    const writeFileContent = jest.fn<Promise<void>, [string, string]>();

    const autofix = makeAutofixService({
      language: 'typescript',
      namespace: 'GatsbyTypes',
      readFileContent,
      writeFileContent,
    });

    when(readFileContent)
      .calledWith('use-static-query.ts')
      .mockResolvedValue(stripIndent`
        const data = useStaticQuery(graphql\`
          query Test {
            test
          }
        \`);
      `);

    when(readFileContent)
      .calledWith('static-query-component.tsx')
      .mockResolvedValue(stripIndent`
        return (
          <StaticQuery
            query={graphql\`
              query Test {
                test
              }
            \`}
            render={data => (
              <TestComponent test={data.test} />
            )}
          />
        );
      `);

    await expect(autofix([
      'use-static-query.ts',
      'static-query-component.tsx',
    ])).resolves.toEqual([
      {
        status: 'fulfilled',
        value: 'use-static-query.ts',
      },
      {
        status: 'fulfilled',
        value: 'static-query-component.tsx',
      },
    ]);

    expect(writeFileContent).toBeCalledWith('use-static-query.ts', stripIndent`
      const data = useStaticQuery<GatsbyTypes.TestQuery>(graphql\`
        query Test {
          test
        }
      \`);
    `);

    expect(writeFileContent).toBeCalledWith('static-query-component.tsx', stripIndent`
      return (
        <StaticQuery<GatsbyTypes.TestQuery>
          query={graphql\`
            query Test {
              test
            }
          \`}
          render={data => (
            <TestComponent test={data.test} />
          )}
        />
      );
    `);
  });
});

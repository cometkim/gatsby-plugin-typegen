import { when } from 'jest-when';
import { stripIndent } from 'common-tags';
import { deeplyMock } from '@cometjs/jest-utils';

import { autoFixFiles } from './service';

const [commonMock] = deeplyMock<typeof import('../../common')>('common');

describe('autoFixFiles', () => {
  it('should insert type definitions automatically for TypeScript files', async () => {
    when(commonMock.readFile)
      .calledWith('use-static-query.ts').mockResolvedValueOnce(stripIndent`
        const data = useStaticQuery(graphql\`
          query Test {
            test
          }
        \`)
      `)
      .calledWith('static-query-component.tsx').mockResolvedValueOnce(stripIndent`
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

    await expect(autoFixFiles({
      files: ['use-static-query.ts', 'static-query-component.tsx'],
      // @ts-ignore
      pluginOptions: {
        language: 'typescript',
        namespace: 'GatsbyTypes',
      },
    })).resolves.toEqual([
      {
        status: 'fullfilled',
        value: undefined,
      },
      {
        status: 'fullfilled',
        value: undefined,
      },
    ]);

    expect(commonMock.writeFile).toBeCalledWith('use-static-query.ts', stripIndent`
      const data = useStaticQuery<TestQuery>(graphql\`
        query Test {
          test
        }
      \`);
    `);

    expect(commonMock.writeFile).toBeCalledWith('static-query-component.tsx', stripIndent`
      return (
        <StaticQuery<TestQuery>
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

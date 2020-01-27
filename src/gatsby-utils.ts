import path from 'path';
import glob from 'glob';
import normalize from 'normalize-path';
import { Store } from 'gatsby';
import getGatsbyDependents from 'gatsby/dist/utils/gatsby-dependents';

export type GatsbyTheme = {
  themeDir: string,
  [key: string]: any,
};

export type GatsbyPlugin = {
  pluginFilepath: string,
  [key: string]: any,
};

export function resolveThemes(themes: GatsbyTheme[]) {
  return themes.reduce((merged, theme) => {
    return [...merged, theme.themeDir];
  }, [] as string[]);
};

interface LoadGatsbySourcesFn {
  (props: {
    store: Store,
  }): Promise<string[]>;
}
// Original implementation from https://github.com/gatsbyjs/gatsby/blob/561d33e2e4/packages/gatsby/src/query/query-compiler.js
export const loadGatsbyFiles: LoadGatsbySourcesFn = async ({
  store,
}) => {
  const {
    program,
    themes,
    flattenedPlugins,
    components,
  } = store.getState();

  const basePath = program.directory;
  const additionalPaths = resolveThemes(
    themes.themes ?? flattenedPlugins.map((plugin: GatsbyPlugin) => ({
      themeDir: plugin.pluginFilepath,
    })),
  );

  const filesRegex = '*.+(t|j)s?(x)';
  // Pattern that will be appended to searched directories.
  // It will match any .js, .jsx, .ts, and .tsx files, that are not
  // inside <searched_directory>/node_modules.
  const pathRegex = `/{${filesRegex},!(node_modules)/**/${filesRegex}}`;

  const modulesThatUseGatsby = await getGatsbyDependents();

  const files = [
    path.join(basePath, 'src'),

    // Copy note:
    // this code locates the source files .cache/fragments/*.js was copied from
    // the original query-compiler.js handles duplicates more gracefully, codegen generates duplicate types
    // path.join(base, `.cache`, `fragments`),

    ...additionalPaths.map(additional => path.join(additional, 'src')),
    ...modulesThatUseGatsby.map(module => module.path),

    // We should be able to remove the following and preliminary tests do suggest
    // that they aren't needed anymore since we transpile node_modules now
    // However, there could be some cases (where a page is outside of src for example)
    // that warrant keeping this and removing later once we have more confidence (and tests)

    // Ensure all page components added as they're not necessarily in the
    // pages directory e.g. a plugin could add a page component. Plugins
    // *should* copy their components (if they add a query) to .cache so that
    // our babel plugin to remove the query on building is active.
    // Otherwise the component will throw an error in the browser of
    // "graphql is not defined".
    ...components.keys() as string[],
  ].reduce((merged, dir) => [
    ...merged,
    ...glob.sync(path.join(dir, pathRegex), { nodir: true }),
  ], [] as string[])
  .filter(file => !file.endsWith('.d.ts'))
  .map(file => normalize(file));

  return [...new Set(files)];
};

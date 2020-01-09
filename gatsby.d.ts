declare module 'gatsby/graphql' {
  export { graphql, introspectionQuery } from 'graphql';
}

declare module 'gatsby/dist/utils/gatsby-dependents' {
  type ModuleInfo = {
    name: string;
    version: string;
    path: string;
  }
  const getDependents: () => ModuleInfo[];
  export default getDependents;
}

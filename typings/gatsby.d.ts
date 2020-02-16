declare module 'gatsby/graphql' {
  export * from 'graphql';
}

declare module 'gatsby/dist/utils/gatsby-dependents' {
  type ModuleInfo = {
    name: string,
    version: string,
    path: string,
  };
  const getDependents: () => ModuleInfo[];
  export default getDependents;
}

declare module 'gatsby/dist/query/file-parser' {
  import { DocumentNode } from 'gatsby/graphql';

  /**
   * @type {Opentracing.Span}
   */
  type Span = any;

  type QueryExtractionResult = {
    filePath: string,
    doc: DocumentNode,
    text: string,
    hash: number,
    isStaticQuery: boolean,
    isHook: boolean,
    templateLoc: unknown,
  };

  export default class FileParser {
    constructor(args: { parentSpan: Span });
    parseFile(file: string, addError: Function): Promise<QueryExtractionResult[] | null>;
    parseFiles(files: Array<string>, addError: Function): Promise<QueryExtractionResult[][]>;
  }
}

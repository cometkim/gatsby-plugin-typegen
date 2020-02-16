export type GatsbyKnownAction = (
  | GatsbyQueryExtractedAction
  | GatsbyReplaceStaticQueryAction
  | GatsbyQueryExtractionBabelSuccessAction
);

export type GatsbyQueryExtractionBabelSuccessAction = {
  type: 'QUERY_EXTRACTION_BABEL_SUCCESS',
  plugin: unknown,
  traceId: string | undefined,
  payload: {
    componentPath: string,
  },
};

export type GatsbyQueryExtractedAction = {
  type: 'QUERY_EXTRACTED',
  plugin: unknown,
  traceId: string | undefined,
  payload: {
    componentPath: string,
    query: string
  },
};

export type GatsbyReplaceStaticQueryAction = {
  type: 'REPLACE_STATIC_QUERY',
  plugin: unknown, // null??? why not undefined LOL
  payload: {
    name: string,
    componentPath: string,
    id: string,
    query: string,
    hash: number,
  },
};

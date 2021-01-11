import type { Store } from 'redux';
import type { IGatsbyState as GatsbyState, ActionsUnion as GatsbyAction } from 'gatsby/dist/redux/types';

export type GatsbyStore = Store<GatsbyState, GatsbyAction>;

// from https://github.com/gatsbyjs/gatsby/blob/6b4b7f81ec/packages/gatsby/src/schema/print.js#L33-L48
export const gatsbyInternalScalars = [
  'Boolean',
  'Buffer',
  'Date',
  'Float',
  'ID',
  'Int',
  'Internal',
  'InternalInput',
  'JSON',
  'Json',
  'Node',
  'NodeInput',
  'Query',
  'String',
];

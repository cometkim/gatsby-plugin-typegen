import { stripIndent } from 'common-tags';

import type { TypegenReporter } from '../src/internal/reporter';

export const testReporter: TypegenReporter = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  verbose: console.debug,
  panic: (msg, e) => {
    console.error(msg);
    throw e;
  },
  panicOnBuild: (msg, e) => {
    console.error(msg);
    throw e;
  },
  stripIndent,
};

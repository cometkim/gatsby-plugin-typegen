import { stripIndent } from 'common-tags';

import type { TypegenReporter } from '../src/internal/reporter';

export const testReporter: TypegenReporter = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error,
  verbose: console.debug,
  panic: msg => {
    throw new Error(msg);
  },
  panicOnBuild: msg => {
    throw new Error(msg);
  },
  stripIndent,
};

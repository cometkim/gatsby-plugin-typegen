/* eslint-disable no-console */

import { stripIndent } from 'common-tags';

import type { TypegenReporter } from '../src/internal/reporter';

export const testReporter: TypegenReporter = {
  stripIndent,
  log: console.log,
  info: console.info,
  warn: console.warn,
  verbose: console.debug,
  error: console.error,
  panic(msg, e) {
    console.error(msg);
    throw e;
  },
  panicOnBuild(msg, e) {
    console.error(msg);
    throw e;
  },
  activity(msg) {
    return {
      start: () => {
        console.group(msg);
      },
      end: () => {
        console.groupEnd();
      },
      panic(e) {
        console.error(msg);
        throw e;
      },
      panicOnBuild(e) {
        console.error(msg);
        throw e;
      },
    };
  },
  progress(msg, total) {
    let count = 0;
    return {
      start: () => {
        console.group(msg);
      },
      end: () => {
        console.groupEnd();
      },
      tick: () => {
        console.log(`tick (${count++}/${total})`);
      },
      done: () => {
        console.groupEnd();
      },
      panic(e) {
        console.error(msg);
        throw e;
      },
      panicOnBuild(e) {
        console.error(msg);
        throw e;
      },
    };
  },
};

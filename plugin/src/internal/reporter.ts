/* eslint-disable no-console */

export interface TypegenReporter {
  log(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  verbose(message: string): void;
  panic(message: string): void;
  panicOnBuild(message: string): void;
  stripIndent(template: TemplateStringsArray, ...substitutions: unknown[]): string;
}

export function makeDefaultReporter(): TypegenReporter {
  return {
    log: console.log,
    warn: console.warn,
    error: console.error,
    verbose: console.log,
    panic: message => {
      throw new Error(message);
    },
    panicOnBuild: message => {
      throw new Error(message);
    },
    stripIndent: String.raw,
  };
}

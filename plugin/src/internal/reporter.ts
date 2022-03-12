export interface TypegenReporter {
  log(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  verbose(message: string): void;
  panic(message: string, _?: undefined): asserts _;
  panicOnBuild(message: string, _?: undefined): asserts _;
  stripIndent(template: TemplateStringsArray, ...substitutions: unknown[]): string;
}

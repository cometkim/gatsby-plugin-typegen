export interface TypegenReporter {
  log(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  verbose(message: string): void;
  panic(message: string, e: unknown): void;
  panicOnBuild(message: string, e: unknown): void;
  stripIndent(template: TemplateStringsArray, ...substitutions: unknown[]): string;
}

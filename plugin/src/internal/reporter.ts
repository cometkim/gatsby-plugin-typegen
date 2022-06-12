interface TypegenActivity {
  start(): void;
  panic(arg: unknown): void;
  panicOnBuild(arg: unknown): void;
  end(): void;
}

interface TypegenProgressActivity extends TypegenActivity {
  tick(): void;
  done(): void;
}

export interface TypegenReporter {
  stripIndent(template: TemplateStringsArray, ...substitutions: unknown[]): string;
  log(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  verbose(message: string): void;
  error(message: string, e?: Error | Error[]): void;
  panic(message: string, e: Error | Error[]): void;
  panicOnBuild(message: string, e: Error | Error[]): void;
  activity(message: string): TypegenActivity;
  progress(message: string, total: number): TypegenProgressActivity;
}

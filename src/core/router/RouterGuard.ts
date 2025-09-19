
export interface GuardResponse {
  redirect(path: string): void;
  resolve(): void;
  break(): void;
  reject(): void;
  readonly path: string;
  readonly params: Record<string, string>;
  readonly query: Record<string, string>;
}

export abstract class RouterGuard {

  abstract beforeEach(response: GuardResponse): void;

}

export const mutableEnv = process.env as Record<string, string | undefined>;

export function withCleanEnv(keys: readonly string[]): void {
  let originalEnv: Record<string, string | undefined>;

  const clearKeys = (): void => {
    keys.forEach((key) => delete mutableEnv[key]);
  };

  beforeEach(() => {
    originalEnv = { ...mutableEnv };
    clearKeys();
  });

  afterEach(() => {
    clearKeys();
    Object.assign(mutableEnv, originalEnv);
  });
}

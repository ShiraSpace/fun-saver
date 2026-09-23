export function captureCookies(): string[] {
  const written: string[] = [];

  beforeEach(() => {
    written.length = 0;

    let jar = '';

    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => jar,
      set: (value: string) => {
        written.push(value);
        jar = value.split(';')[0];
      },
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(document, 'cookie');
  });

  return written;
}

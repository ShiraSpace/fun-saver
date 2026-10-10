export function captureCookies(): string[] {
  const written: string[] = [];

  beforeEach(() => {
    written.length = 0;

    const jar = new Map<string, string>();

    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: () => [...jar].map(([name, value]) => `${name}=${value}`).join('; '),
      set: (cookie: string) => {
        written.push(cookie);
        const [name, value] = cookie.split(';')[0].split('=');
        jar.set(name, value);
      },
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(document, 'cookie');
  });

  return written;
}

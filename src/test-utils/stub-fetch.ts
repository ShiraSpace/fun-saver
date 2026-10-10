export function stubFetch(mockFetch: jest.Mock): void {
  global.fetch = mockFetch as unknown as typeof fetch;
}

export function restoreFetchAfterEach(): void {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });
}

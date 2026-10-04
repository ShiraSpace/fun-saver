export function stubFetch(mockFetch: jest.Mock): jest.Mock {
  global.fetch = mockFetch as unknown as typeof fetch;
  return mockFetch;
}

export function restoreFetchAfterEach(): void {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });
}

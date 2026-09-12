import { mockAccount } from '@/test-utils/fixtures';
import { fetchJson } from '../fetch-json';

const connectionError = new Error('offline');

const mockRequest = {
  url: '/api/accounts/a1',
  method: 'PUT',
  body: { name: 'רוני' },
} as const;

describe('fetchJson', () => {
  const originalFetch = global.fetch;
  let fetchMock: jest.Mock;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('when the route answers', () => {
    beforeEach(() => {
      fetchMock = jest
        .fn()
        .mockResolvedValue({ ok: true, json: async () => mockAccount });
      global.fetch = fetchMock as unknown as typeof fetch;
    });

    it('calls the given url with the given method', async () => {
      await fetchJson(mockRequest);

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe(mockRequest.url);
      expect(init.method).toBe(mockRequest.method);
    });

    it('sends the body as json', async () => {
      await fetchJson(mockRequest);

      const [, init] = fetchMock.mock.calls[0];
      expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
      expect(JSON.parse(init.body)).toEqual(mockRequest.body);
    });

    it('never accepts a cached answer', async () => {
      await fetchJson(mockRequest);

      const [, init] = fetchMock.mock.calls[0];
      expect(init.cache).toBe('no-store');
    });

    it('returns the parsed body', async () => {
      expect(await fetchJson(mockRequest)).toEqual(mockAccount);
    });
  });

  describe('when the route refuses', () => {
    beforeEach(() => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'account not found' }),
      }) as unknown as typeof fetch;
    });

    it('throws rather than returning a body that is not there', async () => {
      await expect(fetchJson(mockRequest)).rejects.toThrow();
    });

    it('names the method, url and status in the error', async () => {
      await expect(fetchJson(mockRequest)).rejects.toThrow(
        `${mockRequest.method} ${mockRequest.url} failed with 404`
      );
    });
  });

  describe('when the connection fails', () => {
    beforeEach(() => {
      global.fetch = jest
        .fn()
        .mockRejectedValue(connectionError) as unknown as typeof fetch;
    });

    it('lets the failure through untouched', async () => {
      await expect(fetchJson(mockRequest)).rejects.toBe(connectionError);
    });
  });
});

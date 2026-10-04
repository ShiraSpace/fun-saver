import { StatusCodes } from 'http-status-codes';
import { API_ERRORS } from '@/app/api/constants';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { SIGN_IN_PATH } from '@/lib/user/constants';
import { goTo } from '../navigate';
import { fetchJson, RequestFailedError } from '../fetch-json';
import { restoreFetchAfterEach, stubFetch } from '@/test-utils/stub-fetch';

jest.mock('../navigate', () => ({ goTo: jest.fn() }));

const connectionError = new Error('offline');

const mockRequest = {
  url: '/api/accounts/a1',
  method: 'PUT',
  body: { name: 'רוני' },
} as const;

describe('fetchJson', () => {
  let mockFetch: jest.Mock;

  restoreFetchAfterEach();

  describe('when the route answers', () => {
    beforeEach(() => {
      mockFetch = jest
        .fn()
        .mockResolvedValue({ ok: true, json: async () => mockAccount });
      stubFetch(mockFetch);
    });

    it('calls the given url with the given method', async () => {
      await fetchJson(mockRequest);

      const [url, init] = mockFetch.mock.calls[0];
      expect(url).toBe(mockRequest.url);
      expect(init.method).toBe(mockRequest.method);
    });

    it('sends the body as json', async () => {
      await fetchJson(mockRequest);

      const [, init] = mockFetch.mock.calls[0];
      expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
      expect(JSON.parse(init.body)).toEqual(mockRequest.body);
    });

    it('never accepts a cached answer', async () => {
      await fetchJson(mockRequest);

      const [, init] = mockFetch.mock.calls[0];
      expect(init.cache).toBe('no-store');
    });

    it('returns the parsed body', async () => {
      expect(await fetchJson(mockRequest)).toEqual(mockAccount);
    });
  });

  describe('when the route refuses', () => {
    beforeEach(() => {
      stubFetch(
        jest.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => ({ error: API_ERRORS.accountNotFound }),
        })
      );
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

  describe('when the session has expired', () => {
    beforeEach(() => {
      jest.mocked(goTo).mockClear();
      stubFetch(
        jest.fn().mockResolvedValue({
          ok: false,
          status: 401,
          json: async () => ({ error: API_ERRORS.notSignedIn }),
        })
      );
    });

    it('sends the browser to the sign-in page', async () => {
      await expect(fetchJson(mockRequest)).rejects.toThrow();

      expect(goTo).toHaveBeenCalledWith(SIGN_IN_PATH);
    });
  });

  describe('when the connection fails', () => {
    beforeEach(() => {
      stubFetch(jest.fn().mockRejectedValue(connectionError));
    });

    it('lets the failure through untouched', async () => {
      await expect(fetchJson(mockRequest)).rejects.toBe(connectionError);
    });
  });

  describe('when the route answers with a conflict', () => {
    let failure: unknown;

    beforeEach(async () => {
      stubFetch(
        jest.fn().mockResolvedValue({
          ok: false,
          status: StatusCodes.CONFLICT,
          json: async () => ({ error: API_ERRORS.goalNotActive }),
        })
      );
      failure = await fetchJson(mockRequest).catch((error) => error);
    });

    it('throws a RequestFailedError', () => {
      expect(failure).toBeInstanceOf(RequestFailedError);
    });

    it('carries the response status', () => {
      expect(failure).toHaveProperty('status', StatusCodes.CONFLICT);
    });
  });

  describe('a DELETE without a body', () => {
    const mockDeleteRequest = {
      url: '/api/accounts/a1/goals/g1',
      method: 'DELETE',
    } as const;

    beforeEach(async () => {
      mockFetch = jest
        .fn()
        .mockResolvedValue({ ok: true, json: async () => mockAccount });
      stubFetch(mockFetch);
      await fetchJson(mockDeleteRequest);
    });

    it('sends no body', () => {
      const [, init] = mockFetch.mock.calls[0];
      expect(init.body).toBeUndefined();
    });
  });
});

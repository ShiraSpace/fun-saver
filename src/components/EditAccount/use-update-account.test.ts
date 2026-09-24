import { renderHook } from '@testing-library/react';
import type { Account } from '@/lib/types';
import { mockAccount, mockAccountEdits } from '@/test-utils/fixtures';
import { useUpdateAccount } from './use-update-account';

describe('useUpdateAccount', () => {
  const originalFetch = global.fetch;
  let fetchMock: jest.Mock;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('when the request succeeds', () => {
    beforeEach(() => {
      fetchMock = jest
        .fn()
        .mockResolvedValue({ ok: true, json: async () => mockAccount });
      global.fetch = fetchMock as unknown as typeof fetch;
    });

    function updateAccount(): Promise<Account> {
      const { result } = renderHook(() => useUpdateAccount());
      return result.current.updateAccount(mockAccount.id, mockAccountEdits);
    }

    it('puts to the endpoint for that account', async () => {
      await updateAccount();

      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe(`/api/accounts/${mockAccount.id}`);
      expect(init.method).toBe('PUT');
    });

    it('sends the edits as the body, uncached', async () => {
      await updateAccount();

      const [, init] = fetchMock.mock.calls[0];
      expect(JSON.parse(init.body)).toEqual(mockAccountEdits);
      expect(init.cache).toBe('no-store');
    });

    it('returns the account the route answered with', async () => {
      expect(await updateAccount()).toEqual(mockAccount);
    });
  });

  it('throws when the request fails', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const { result } = renderHook(() => useUpdateAccount());

    await expect(
      result.current.updateAccount(mockAccount.id, mockAccountEdits)
    ).rejects.toThrow();
  });
});

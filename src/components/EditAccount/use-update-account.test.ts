import { renderHook } from '@testing-library/react';
import { mockAccount, mockAccountEdit } from '@/test-support/fixtures';
import { useUpdateAccount } from './use-update-account';

describe('useUpdateAccount', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('puts the edits to the account endpoint and returns the account', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => mockAccount });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() => useUpdateAccount());
    const account = await result.current.updateAccount(
      mockAccount.id,
      mockAccountEdit
    );

    expect(account).toEqual(mockAccount);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(`/api/accounts/${mockAccount.id}`);
    expect(init.method).toBe('PUT');
    expect(init.cache).toBe('no-store');
    expect(JSON.parse(init.body)).toEqual(mockAccountEdit);
  });

  it('throws when the request fails', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const { result } = renderHook(() => useUpdateAccount());

    await expect(
      result.current.updateAccount(mockAccount.id, mockAccountEdit)
    ).rejects.toThrow();
  });
});

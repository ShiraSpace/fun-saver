import { renderHook } from '@testing-library/react';
import { mockAccount, mockCreateAccountInput } from '@/test-support/fixtures';
import { useCreateAccount } from './use-create-account';

describe('useCreateAccount', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('posts the new account to the accounts endpoint and returns it', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => mockAccount });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() => useCreateAccount());
    const account = await result.current.createAccount(mockCreateAccountInput);

    expect(account).toEqual(mockAccount);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/accounts');
    expect(init.method).toBe('POST');
    expect(init.cache).toBe('no-store');
    expect(JSON.parse(init.body)).toEqual(mockCreateAccountInput);
  });

  it('throws when the request fails', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const { result } = renderHook(() => useCreateAccount());

    await expect(
      result.current.createAccount(mockCreateAccountInput)
    ).rejects.toThrow();
  });
});

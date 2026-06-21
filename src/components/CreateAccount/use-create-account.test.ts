import { renderHook } from '@testing-library/react';
import { ACCOUNT, CREATE_ACCOUNT_INPUT } from '@/test-support/fixtures';
import { useCreateAccount } from './use-create-account';

describe('useCreateAccount', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('posts the new account to the accounts endpoint and returns it', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ACCOUNT });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() => useCreateAccount());
    const account = await result.current.createAccount(CREATE_ACCOUNT_INPUT);

    expect(account).toEqual(ACCOUNT);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/accounts');
    expect(init.method).toBe('POST');
    expect(init.cache).toBe('no-store');
    expect(JSON.parse(init.body)).toEqual(CREATE_ACCOUNT_INPUT);
  });

  it('throws when the request fails', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const { result } = renderHook(() => useCreateAccount());

    await expect(
      result.current.createAccount(CREATE_ACCOUNT_INPUT)
    ).rejects.toThrow();
  });
});

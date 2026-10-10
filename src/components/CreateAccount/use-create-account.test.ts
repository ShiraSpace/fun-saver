import { renderHook } from '@testing-library/react';
import {
  mockAccount,
  mockCreateAccountInput,
} from '@/test-utils/mocks/account.mocks';
import { restoreFetchAfterEach, stubFetch } from '@/test-utils/stub-fetch';
import { useCreateAccount } from './use-create-account';

describe('useCreateAccount', () => {
  restoreFetchAfterEach();

  it('posts the new account to the accounts endpoint and returns it', async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => mockAccount });
    stubFetch(mockFetch);

    const { result } = renderHook(() => useCreateAccount());
    const account = await result.current.createAccount(mockCreateAccountInput);

    expect(account).toEqual(mockAccount);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/accounts');
    expect(init.method).toBe('POST');
    expect(init.cache).toBe('no-store');
    expect(JSON.parse(init.body)).toEqual(mockCreateAccountInput);
  });

  it('throws when the request fails', async () => {
    stubFetch(jest.fn().mockResolvedValue({ ok: false }));

    const { result } = renderHook(() => useCreateAccount());

    await expect(
      result.current.createAccount(mockCreateAccountInput)
    ).rejects.toThrow();
  });
});

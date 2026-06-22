import { renderHook } from '@testing-library/react';
import { useAddTransaction } from './use-add-transaction';

describe('useAddTransaction', () => {
  const originalFetch = global.fetch;
  const ACCOUNT_ID = 'account-1';

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('posts the amount to the account deposits endpoint', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as unknown as typeof fetch;

    const { result } = renderHook(() => useAddTransaction(ACCOUNT_ID));
    await result.current.addDeposit(20);

    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBe(`/api/accounts/${ACCOUNT_ID}/deposits`);
    expect(init.method).toBe('POST');
    expect(init.cache).toBe('no-store');
    expect(JSON.parse(init.body)).toEqual({ amount: 20 });
  });

  it('throws when the request fails', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: false }) as unknown as typeof fetch;

    const { result } = renderHook(() => useAddTransaction(ACCOUNT_ID));

    await expect(result.current.addDeposit(20)).rejects.toThrow();
  });
});

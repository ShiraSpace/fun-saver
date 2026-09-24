import { renderHook } from '@testing-library/react';
import { useAddTransaction } from './use-add-transaction';

describe('useAddTransaction', () => {
  const originalFetch = global.fetch;
  const mockAccountId = 'account-1';
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => [] });
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  function hook(): ReturnType<typeof useAddTransaction> {
    return renderHook(() => useAddTransaction(mockAccountId)).result.current;
  }

  it('posts the amount to the account deposits endpoint', async () => {
    await hook().addDeposit(20);

    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBe(`/api/accounts/${mockAccountId}/deposits`);
    expect(init.method).toBe('POST');
    expect(init.cache).toBe('no-store');
    expect(JSON.parse(init.body)).toEqual({ amount: 20 });
  });

  it('throws when the deposit request fails', async () => {
    fetchMock.mockResolvedValue({ ok: false });

    await expect(hook().addDeposit(20)).rejects.toThrow();
  });

  it('posts the wallet and amount to the account withdrawals endpoint', async () => {
    await hook().addWithdrawal('w2', 15);

    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBe(`/api/accounts/${mockAccountId}/withdrawals`);
    expect(init.method).toBe('POST');
    expect(init.cache).toBe('no-store');
    expect(JSON.parse(init.body)).toEqual({ walletId: 'w2', amount: 15 });
  });

  it('throws when the withdrawal request fails', async () => {
    fetchMock.mockResolvedValue({ ok: false });

    await expect(hook().addWithdrawal('w2', 15)).rejects.toThrow();
  });
});

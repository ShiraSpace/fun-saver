import { fetchJson } from '@/lib/fetch-json';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockWalletSummaries } from '@/test-utils/mocks/wallet.mocks';
import { deposit, withdraw } from '../transaction-requests';

jest.mock('@/lib/fetch-json');

describe('transaction requests', () => {
  it("deposit posts the amount to the account's deposits", async () => {
    await deposit(mockAccount.id, 20);

    expect(fetchJson).toHaveBeenCalledWith({
      url: `/api/accounts/${mockAccount.id}/deposits`,
      method: 'POST',
      body: { amount: 20 },
    });
  });

  it("withdraw posts the wallet and amount to the account's withdrawals", async () => {
    const [mockSavings] = mockWalletSummaries;

    await withdraw({ accountId: mockAccount.id, walletId: mockSavings.id, amountShekels: 15 });

    expect(fetchJson).toHaveBeenCalledWith({
      url: `/api/accounts/${mockAccount.id}/withdrawals`,
      method: 'POST',
      body: { walletId: mockSavings.id, amount: 15 },
    });
  });
});

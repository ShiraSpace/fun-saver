import { defaultWithdrawalWallet } from '../default-withdrawal-wallet';
import { mockWalletSummaries } from '@/test-utils/mocks/wallet.mocks';

describe('the default withdrawal wallet', () => {
  const [savings, spending, goodDeeds] = mockWalletSummaries;
  const mockEmptySpending = { ...spending, balance: 0 };

  it('is the spending wallet when it has money', () => {
    expect(defaultWithdrawalWallet(mockWalletSummaries)).toBe(spending);
  });

  it('is the spending wallet whatever order the wallets come in', () => {
    expect(defaultWithdrawalWallet([goodDeeds, savings, spending])).toBe(
      spending
    );
  });

  it('falls back to the good-deeds wallet when spending is empty', () => {
    expect(
      defaultWithdrawalWallet([savings, mockEmptySpending, goodDeeds])
    ).toBe(goodDeeds);
  });

  it('is never the savings wallet, even when only savings has money', () => {
    expect(
      defaultWithdrawalWallet([
        savings,
        mockEmptySpending,
        { ...goodDeeds, balance: 0 },
      ])
    ).toBe(mockEmptySpending);
  });
});

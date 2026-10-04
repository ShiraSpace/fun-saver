import { defaultWithdrawalWallet } from '../default-withdrawal-wallet';
import { mockWalletSummaries } from '@/test-utils/mocks/wallet.mocks';

describe('the default withdrawal wallet', () => {
  const [mockSavings, mockSpending, mockGoodDeeds] = mockWalletSummaries;

  it('is the spending wallet when it has money', () => {
    expect(defaultWithdrawalWallet(mockWalletSummaries)).toBe(mockSpending);
  });

  it('is the spending wallet whatever order the wallets come in', () => {
    expect(
      defaultWithdrawalWallet([mockGoodDeeds, mockSavings, mockSpending])
    ).toBe(mockSpending);
  });

  describe('when spending is empty', () => {
    const mockEmptySpending = { ...mockSpending, balance: 0 };

    it('falls back to the good-deeds wallet', () => {
      expect(
        defaultWithdrawalWallet([mockSavings, mockEmptySpending, mockGoodDeeds])
      ).toBe(mockGoodDeeds);
    });

    it('is never the savings wallet, even when only savings has money', () => {
      expect(
        defaultWithdrawalWallet([
          mockSavings,
          mockEmptySpending,
          { ...mockGoodDeeds, balance: 0 },
        ])
      ).toBe(mockEmptySpending);
    });
  });
});

import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import { createMockTransaction } from '@/test-utils/mocks/transaction.mocks';
import {
  createMockWallet,
  createMockWallets,
  createMockWalletSummary,
  mockWalletSummaries,
} from '@/test-utils/mocks/wallet.mocks';
import type { WalletSummary } from '../types';
import {
  defaultWithdrawalWallet,
  savingsFirst,
  savingsWithoutAgorot,
  summarizeWallet,
  walletNamed,
  walletsWithoutAgorot,
} from '../wallet';

describe('walletNamed', () => {
  describe("an account's three wallets", () => {
    const mockWallets = createMockWallets();

    it('finds the spending wallet by its name', () => {
      expect(walletNamed(mockWallets, 'spending')?.name).toBe('spending');
    });
  });

  describe('an account with no wallets yet', () => {
    it('finds nothing', () => {
      expect(walletNamed([], 'savings')).toBeUndefined();
    });
  });
});

describe('savingsFirst', () => {
  const [mockSavings, mockSpending, mockGoodDeeds] = createMockWallets();

  describe('wallets with savings in the middle', () => {
    const mockWallets = [mockSpending, mockSavings, mockGoodDeeds];

    it('puts savings first', () => {
      expect(savingsFirst(mockWallets)[0]).toBe(mockSavings);
    });

    it('keeps the other wallets in their order', () => {
      const otherWallets = savingsFirst(mockWallets).filter((wallet) => wallet !== mockSavings);

      expect(otherWallets).toEqual([mockSpending, mockGoodDeeds]);
    });
  });

  describe('wallets without savings', () => {
    it('keeps them in their order', () => {
      expect(savingsFirst([mockGoodDeeds, mockSpending])).toEqual([mockGoodDeeds, mockSpending]);
    });
  });
});

describe('the default withdrawal wallet', () => {
  const [mockSavings, mockSpending, mockGoodDeeds] = mockWalletSummaries;

  it('is the spending wallet when it has money', () => {
    expect(defaultWithdrawalWallet(mockWalletSummaries)).toBe(mockSpending);
  });

  it('is the spending wallet whatever order the wallets come in', () => {
    expect(defaultWithdrawalWallet([mockGoodDeeds, mockSavings, mockSpending])).toBe(mockSpending);
  });

  describe('when spending is empty', () => {
    const mockEmptySpending = { ...mockSpending, balance: 0 };

    it('falls back to the good-deeds wallet', () => {
      expect(defaultWithdrawalWallet([mockSavings, mockEmptySpending, mockGoodDeeds])).toBe(
        mockGoodDeeds
      );
    });

    it('is never the savings wallet, even when only savings has money', () => {
      expect(
        defaultWithdrawalWallet([mockSavings, mockEmptySpending, { ...mockGoodDeeds, balance: 0 }])
      ).toBe(mockEmptySpending);
    });
  });
});

describe('savingsWithoutAgorot', () => {
  describe('savings of ₪148.90, ₪6.40 of it interest', () => {
    const mockSavings = { balance: 14890, interestEarned: 640 };

    it('shows the balance without the agorot the child cannot count yet', () => {
      expect(savingsWithoutAgorot(mockSavings).balance).toBe(14800);
    });

    it('shows what the money earned by itself in whole shekels', () => {
      expect(savingsWithoutAgorot(mockSavings).interestEarned).toBe(600);
    });
  });

  describe('savings of ₪148.50, ₪6.90 of it interest', () => {
    it('shows what the child put in as the rest, so the two add up to the balance', () => {
      expect(savingsWithoutAgorot({ balance: 14850, interestEarned: 690 }).principal).toBe(14200);
    });
  });

  describe('withdrawals took more than was deposited, so interest is more than the balance', () => {
    const mockSavings = { balance: 300, interestEarned: 500 };

    it('never shows a negative amount put in', () => {
      expect(savingsWithoutAgorot(mockSavings).principal).toBe(0);
    });

    it('counts the whole balance as earned, so the tiles still add up', () => {
      expect(savingsWithoutAgorot(mockSavings).interestEarned).toBe(300);
    });
  });

  describe('savings that have not earned interest yet', () => {
    it('shows nothing earned', () => {
      expect(savingsWithoutAgorot({ balance: 1200, interestEarned: 0 }).interestEarned).toBe(0);
    });
  });
});

describe('walletsWithoutAgorot', () => {
  describe('savings of ₪46.69 beside spending of ₪50', () => {
    const mockWallets = [
      createMockWalletSummary({ name: 'savings', balance: 4669 }),
      createMockWalletSummary({ name: 'spending', balance: 5000 }),
    ];

    it('shows each balance without its agorot', () => {
      expect(walletsWithoutAgorot(mockWallets).map((wallet) => wallet.balance)).toEqual([
        4600, 5000,
      ]);
    });

    it('keeps the rest of each wallet', () => {
      expect(walletsWithoutAgorot(mockWallets).map((wallet) => wallet.name)).toEqual([
        'savings',
        'spending',
      ]);
    });
  });
});

describe('summarizeWallet', () => {
  const mockWallet = createMockWallet({ lastInterestDate: '2026-01-03' });

  const mockTransactions = [
    createMockTransaction({ id: 'd', amount: 8000 }),
    createMockTransaction({
      id: 'i',
      type: TRANSACTION_TYPE.interest,
      amount: 500,
      occurredAt: '2026-01-03',
    }),
    createMockTransaction({
      id: 'w',
      type: TRANSACTION_TYPE.withdrawal,
      amount: 2000,
    }),
  ];

  let walletSummary: WalletSummary;

  beforeEach(() => {
    walletSummary = summarizeWallet({
      wallet: mockWallet,
      transactions: mockTransactions,
      asOf: '2026-01-03',
    });
  });

  it('keeps the wallet it was given', () => {
    expect(walletSummary).toMatchObject(mockWallet);
  });

  it('nets the balance across every transaction', () => {
    expect(walletSummary.balance).toBe(6500);
  });

  it('nets the principal without the interest', () => {
    expect(walletSummary.principal).toBe(6000);
  });

  it('sums what has been withdrawn', () => {
    expect(walletSummary.withdrawn).toBe(2000);
  });

  it('sums the interest earned', () => {
    expect(walletSummary.interestEarned).toBe(500);
  });

  it('picks out the interest dated today', () => {
    expect(walletSummary.interestEarnedToday).toBe(500);
  });
});

import { summarizeWallet } from '../summarize-wallet';
import type { WalletSummary } from '../types';
import { createMockTransaction, createMockWallet } from '@/test-utils/fixtures';

const mockWallet = createMockWallet({ lastInterestDate: '2026-01-03' });

const mockTransactions = [
  createMockTransaction({ id: 'd', amount: 8000 }),
  createMockTransaction({
    id: 'i',
    type: 'interest',
    amount: 500,
    occurredAt: '2026-01-03',
  }),
  createMockTransaction({ id: 'w', type: 'withdrawal', amount: 2000 }),
];

describe('deriveWallet', () => {
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

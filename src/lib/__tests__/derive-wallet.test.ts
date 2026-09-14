import { deriveWallet } from '../derive-wallet';
import type { WalletWithDerived } from '../types';
import { createMockTransaction, createMockWallet } from '@/test-utils/fixtures';

const wallet = createMockWallet({ lastInterestDate: '2026-01-03' });

const transactions = [
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
  let derived: WalletWithDerived;

  beforeEach(() => {
    derived = deriveWallet({ wallet, transactions, asOf: '2026-01-03' });
  });

  it('keeps the wallet it was given', () => {
    expect(derived).toMatchObject(wallet);
  });

  it('nets the balance across every transaction', () => {
    expect(derived.balance).toBe(6500);
  });

  it('nets the principal without the interest', () => {
    expect(derived.principal).toBe(6000);
  });

  it('sums what has been withdrawn', () => {
    expect(derived.withdrawals).toBe(2000);
  });

  it('sums the interest earned', () => {
    expect(derived.interestGain).toBe(500);
  });

  it('picks out the interest dated today', () => {
    expect(derived.todayInterest).toBe(500);
  });
});

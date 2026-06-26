import { deriveWallet } from '../derive-wallet';
import {
  createMockTransaction,
  createMockWallet,
} from '@/test-support/fixtures';

const wallet = createMockWallet({ lastInterestDate: '2026-01-03' });

const transactions = [
  createMockTransaction({ id: 'd', amount: 8000 }),
  createMockTransaction({
    id: 'i',
    type: 'interest',
    amount: 500,
    occurredAt: '2026-01-03',
  }),
];

describe('deriveWallet', () => {
  it('augments a wallet with balance, principal, gain and today interest', () => {
    expect(deriveWallet(wallet, transactions, '2026-01-03')).toMatchObject({
      ...wallet,
      balance: 8500,
      principal: 8000,
      interestGain: 500,
      todayInterest: 500,
    });
  });
});

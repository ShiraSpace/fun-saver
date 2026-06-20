import { deriveWallet } from '../derive-wallet';
import type { Transaction, Wallet } from '../types';

const wallet: Wallet = {
  id: 'w1',
  accountId: 'a1',
  name: 'savings',
  icon: '🐷',
  monthlyInterestRate: 0.15,
  openedAt: '2026-01-01',
  lastInterestDate: '2026-01-03',
};

const txns: Transaction[] = [
  {
    id: 'd',
    walletId: 'w1',
    type: 'deposit',
    amount: 8000,
    occurredAt: '2026-01-01',
  },
  {
    id: 'i',
    walletId: 'w1',
    type: 'interest',
    amount: 500,
    occurredAt: '2026-01-03',
  },
];

describe('deriveWallet', () => {
  it('augments a wallet with balance, principal, gain and today interest', () => {
    expect(deriveWallet(wallet, txns, '2026-01-03')).toMatchObject({
      ...wallet,
      balance: 8500,
      principal: 8000,
      interestGain: 500,
      todayInterest: 500,
    });
  });
});

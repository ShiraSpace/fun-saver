import type { Account, WalletWithDerived } from '@/lib/types';

export const ACCOUNT: Account = {
  id: 'a1',
  name: 'נועה',
  avatarId: 'kid-01',
  isActive: true,
};

export const CREATE_ACCOUNT_INPUT = {
  name: ACCOUNT.name,
  avatarId: ACCOUNT.avatarId,
};

export const DERIVED_WALLETS: WalletWithDerived[] = [
  {
    id: 'w1',
    accountId: 'a1',
    name: 'savings',
    icon: '🐷',
    monthlyInterestRate: 0.15,
    openedAt: '2026-01-01',
    lastInterestDate: '2026-01-01',
    balance: 8500,
    principal: 8000,
    interestGain: 500,
    todayInterest: 150,
  },
  {
    id: 'w2',
    accountId: 'a1',
    name: 'spending',
    icon: '🛍️',
    monthlyInterestRate: 0,
    openedAt: '2026-01-01',
    lastInterestDate: '2026-01-01',
    balance: 5000,
    principal: 5000,
    interestGain: 0,
    todayInterest: 0,
  },
  {
    id: 'w3',
    accountId: 'a1',
    name: 'goodDeeds',
    icon: '💛',
    monthlyInterestRate: 0,
    openedAt: '2026-01-01',
    lastInterestDate: '2026-01-01',
    balance: 2500,
    principal: 2500,
    interestGain: 0,
    todayInterest: 0,
  },
];

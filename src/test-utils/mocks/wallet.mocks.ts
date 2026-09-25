import type { Wallet, WalletSummary } from '@/lib/wallet/types';
import { DEFAULT_WALLETS } from '@/lib/wallet/constants';

export function createMockWallet(overrides: Partial<Wallet> = {}): Wallet {
  return {
    id: 'w1',
    name: 'savings',
    icon: '🐷',
    monthlyInterestRate: 0.15,
    openedAt: '2026-01-01',
    lastInterestDate: '2026-01-01',
    ...overrides,
  };
}

export function createMockWallets(): Wallet[] {
  return DEFAULT_WALLETS.map((defaultWallet, index) =>
    createMockWallet({
      id: `w${index + 1}`,
      name: defaultWallet.name,
      icon: defaultWallet.icon,
      monthlyInterestRate: defaultWallet.monthlyInterestRate,
    })
  );
}

export function createMockWalletSummary(
  overrides: Partial<WalletSummary> = {}
): WalletSummary {
  return {
    ...createMockWallet(),
    balance: 8500,
    principal: 8000,
    withdrawn: 0,
    interestEarned: 500,
    interestEarnedToday: 150,
    ...overrides,
  };
}

const mockWalletBalances: Pick<
  WalletSummary,
  | 'balance'
  | 'principal'
  | 'withdrawn'
  | 'interestEarned'
  | 'interestEarnedToday'
>[] = [
  {
    balance: 8500,
    principal: 8000,
    withdrawn: 0,
    interestEarned: 500,
    interestEarnedToday: 150,
  },
  {
    balance: 5000,
    principal: 5000,
    withdrawn: 4500,
    interestEarned: 0,
    interestEarnedToday: 0,
  },
  {
    balance: 2500,
    principal: 2500,
    withdrawn: 1800,
    interestEarned: 0,
    interestEarnedToday: 0,
  },
];

export const mockWalletSummaries: WalletSummary[] = createMockWallets().map(
  (wallet, index) =>
    createMockWalletSummary({ ...wallet, ...mockWalletBalances[index] })
);

export const mockWalletShares: number[] = [53, 31, 16];

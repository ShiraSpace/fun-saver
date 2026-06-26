import type {
  Account,
  Transaction,
  Wallet,
  WalletWithDerived,
} from '@/lib/types';
import { DEFAULT_WALLETS } from '@/lib/constants';

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
  return DEFAULT_WALLETS.map((seed, index) =>
    createMockWallet({
      id: `w${index + 1}`,
      name: seed.name,
      icon: seed.icon,
      monthlyInterestRate: seed.monthlyInterestRate,
    })
  );
}

export function createMockAccount(overrides: Partial<Account> = {}): Account {
  return {
    id: 'a1',
    name: 'נועה',
    avatarId: 'kid-01',
    isActive: true,
    wallets: createMockWallets(),
    ...overrides,
  };
}

export function createMockTransaction(
  overrides: Partial<Transaction> = {}
): Transaction {
  return {
    id: 't1',
    walletId: 'w1',
    accountId: 'a1',
    type: 'deposit',
    amount: 8000,
    occurredAt: '2026-01-01',
    ...overrides,
  };
}

export function createMockDerivedWallet(
  overrides: Partial<WalletWithDerived> = {}
): WalletWithDerived {
  return {
    ...createMockWallet(),
    balance: 8500,
    principal: 8000,
    interestGain: 500,
    todayInterest: 150,
    ...overrides,
  };
}

export const mockAccount: Account = createMockAccount();

export const mockSecondAccount: Account = createMockAccount({
  id: 'a2',
  name: 'מתן',
  avatarId: 'kid-08',
  wallets: [],
});

export const mockCreateAccountInput = {
  name: mockAccount.name,
  avatarId: mockAccount.avatarId,
};

export const mockTransactions: Transaction[] = [
  createMockTransaction(),
  createMockTransaction({ id: 't2', type: 'interest', amount: 500 }),
  createMockTransaction({ id: 't3', walletId: 'w2', amount: 5000 }),
  createMockTransaction({ id: 't4', walletId: 'w3', amount: 2500 }),
];

const MOCK_DERIVED_VALUES: Pick<
  WalletWithDerived,
  'balance' | 'principal' | 'interestGain' | 'todayInterest'
>[] = [
  { balance: 8500, principal: 8000, interestGain: 500, todayInterest: 150 },
  { balance: 5000, principal: 5000, interestGain: 0, todayInterest: 0 },
  { balance: 2500, principal: 2500, interestGain: 0, todayInterest: 0 },
];

export const mockDerivedWallets: WalletWithDerived[] = createMockWallets().map(
  (wallet, index) =>
    createMockDerivedWallet({ ...wallet, ...MOCK_DERIVED_VALUES[index] })
);

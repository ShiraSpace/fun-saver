/*
 * Legacy catch-all, being split up. Do not add new mocks here.
 * Create a dedicated `<domain>.mocks.ts` beside this file (for example
 * `transaction.mocks.ts`), put new mocks there, and move over any
 * mocks from this file that belong to that domain.
 */
import type { Account, AccountUser, AccountSummary, User } from '@/lib/types';
import type { Wallet, WalletSummary } from '@/lib/wallet/types';
import type { AccountOwner } from '@/db/data-store';
import { DEFAULT_WALLETS } from '@/lib/wallet/constants';
import { DEFAULT_THEME_ID } from '@/theme/registry';
import type { AccountsContextValue } from '@/components/Home/accounts-context';

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

export function createMockAccount(overrides: Partial<Account> = {}): Account {
  return {
    id: 'a1',
    name: 'נועה',
    avatarId: 'kid-01',
    isActive: true,
    themeId: DEFAULT_THEME_ID,
    wallets: createMockWallets(),
    ...overrides,
  };
}

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'u1',
    provider: 'google',
    providerAccountId: 'google-sub-1',
    email: 'eli@example.com',
    name: 'אלי',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
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

export function createMockAccountUser(
  overrides: Partial<AccountUser> = {}
): AccountUser {
  return {
    accountId: 'a1',
    userId: 'u1',
    role: 'owner',
    addedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export const mockAccount: Account = createMockAccount();

export const mockSiblingAccount: Account = createMockAccount({
  id: 'a2',
  name: 'מתן',
  avatarId: 'kid-08',
  wallets: [],
});

export const mockUser: User = createMockUser();

export const mockCoParent: User = createMockUser({
  id: 'u2',
  providerAccountId: 'google-sub-2',
  email: 'mushit@example.com',
  name: 'מושית',
});

export const mockAccountUser: AccountUser = createMockAccountUser();

export const mockOwner: AccountOwner = {
  userId: mockUser.id,
  addedAt: mockAccountUser.addedAt,
};

export const mockStrangerOwner: AccountOwner = {
  userId: 'ghost',
  addedAt: mockAccountUser.addedAt,
};

export const mockCreateAccountInput = {
  name: mockAccount.name,
  avatarId: mockAccount.avatarId,
};

export const mockAccountEdits = {
  name: 'רוני',
  avatarId: 'kid-07',
};

const mockWalletTotals: Pick<
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
    createMockWalletSummary({ ...wallet, ...mockWalletTotals[index] })
);

export const mockWalletShares: number[] = [53, 31, 16];

export const mockAccountSummary: AccountSummary = {
  ...createMockAccount(),
  wallets: mockWalletSummaries,
};

export const mockSiblingAccountSummary: AccountSummary = {
  ...mockSiblingAccount,
  wallets: [createMockWalletSummary({ id: 'w4', balance: 4200 })],
};

export const mockAccountsContext: AccountsContextValue = {
  accounts: [mockAccountSummary, mockSiblingAccountSummary],
  currentAccount: mockAccountSummary,
  switchAccount: () => {},
};

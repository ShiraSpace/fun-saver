import type { Account, AccountUser, AccountSummary } from '@/lib/account/types';
import type { AccountOwner } from '@/db/data-store';
import { DEFAULT_THEME_ID } from '@/theme/registry';
import type { AccountsContextValue } from '@/components/Home/accounts-context';
import { mockUser } from './user.mocks';
import {
  createMockWallets,
  createMockWalletSummary,
  mockWalletSummaries,
} from './wallet.mocks';

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

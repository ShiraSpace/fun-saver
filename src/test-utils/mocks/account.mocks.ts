import type { Account, AccountUser, AccountSummary } from '@/lib/account/types';
import { VIEW_MODE } from '@/lib/account/view-mode';
import type { AccountOwner } from '@/db/data-store';
import { DEFAULT_THEME_ID } from '@/theme/registry';
import type { AccountsContextValue } from '@/components/Home/accounts-context';
import { mockCoParent, mockUser } from './user.mocks';
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
    viewMode: VIEW_MODE.parent,
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

export function createMockViewer(accountId: string): AccountUser {
  return createMockAccountUser({
    accountId,
    userId: mockCoParent.id,
    role: 'viewer',
  });
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

export function createMockAccountsContext(
  overrides: Partial<AccountsContextValue> = {}
): AccountsContextValue {
  return {
    accounts: [mockAccountSummary, mockSiblingAccountSummary],
    currentAccount: mockAccountSummary,
    switchAccount: (): void => {},
    ...overrides,
  };
}

export const mockChildAccountSummary: AccountSummary = {
  ...mockAccountSummary,
  viewMode: VIEW_MODE.child,
};

export function createMockChildAccountsContext(
  overrides: Partial<AccountsContextValue> = {}
): AccountsContextValue {
  return createMockAccountsContext({
    accounts: [mockChildAccountSummary, mockSiblingAccountSummary],
    currentAccount: mockChildAccountSummary,
    ...overrides,
  });
}

export const mockAccountsContext = createMockAccountsContext();

export const mockChildAccountsContext = createMockChildAccountsContext();

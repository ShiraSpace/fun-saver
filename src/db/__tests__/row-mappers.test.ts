import {
  toAccount,
  toAccountMember,
  toTransaction,
  toUser,
  type AccountMemberRow,
  type AccountRow,
  type TransactionRow,
  type UserRow,
} from '../row-mappers';
import {
  createMockTransaction,
  createMockWallets,
  mockAccount,
} from '@/test-utils/fixtures';
import { DEFAULT_THEME_ID } from '@/theme/registry';

const accountRow: AccountRow = {
  id: mockAccount.id,
  name: mockAccount.name,
  avatar_id: mockAccount.avatarId,
  is_active: mockAccount.isActive,
  theme_id: DEFAULT_THEME_ID,
  wallets: createMockWallets(),
};

const transaction = createMockTransaction();

const transactionRow: TransactionRow = {
  id: transaction.id,
  wallet_id: transaction.walletId,
  account_id: transaction.accountId,
  type: transaction.type,
  amount: transaction.amount,
  occurred_at: transaction.occurredAt,
  created_at: transaction.createdAt,
};

const userRow: UserRow = {
  id: 'u1',
  provider: 'google',
  provider_account_id: 'google-sub-1',
  email: 'eli@example.com',
  name: 'אלי',
  created_at: '2026-01-01T00:00:00.000Z',
};

const accountMemberRow: AccountMemberRow = {
  account_id: mockAccount.id,
  user_id: userRow.id,
  role: 'owner',
  added_at: '2026-01-01T00:00:00.000Z',
};

describe('toAccount', () => {
  it('maps an account row to an Account', () => {
    expect(toAccount(accountRow)).toEqual(mockAccount);
  });
});

describe('toTransaction', () => {
  it('maps a transaction row to a Transaction', () => {
    expect(toTransaction(transactionRow)).toEqual(transaction);
  });
});

describe('toUser', () => {
  it('maps a user row to a User', () => {
    expect(toUser(userRow)).toEqual({
      id: 'u1',
      provider: 'google',
      providerAccountId: 'google-sub-1',
      email: 'eli@example.com',
      name: 'אלי',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  });
});

describe('toAccountMember', () => {
  it('maps an account member row to an AccountMember', () => {
    expect(toAccountMember(accountMemberRow)).toEqual({
      accountId: mockAccount.id,
      userId: 'u1',
      role: 'owner',
      addedAt: '2026-01-01T00:00:00.000Z',
    });
  });
});

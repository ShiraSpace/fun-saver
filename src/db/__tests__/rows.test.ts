import {
  accountFromRow,
  accountUserFromRow,
  transactionFromRow,
  userFromRow,
  type AccountUserRow,
  type AccountRow,
  type TransactionRow,
  type UserRow,
} from '../rows';
import { createMockTransaction } from '@/test-utils/mocks/transaction.mocks';
import { createMockWallets } from '@/test-utils/mocks/wallet.mocks';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { DEFAULT_THEME_ID } from '@/theme/registry';

const mockAccountRow: AccountRow = {
  id: mockAccount.id,
  name: mockAccount.name,
  avatar_id: mockAccount.avatarId,
  is_active: mockAccount.isActive,
  theme_id: DEFAULT_THEME_ID,
  wallets: createMockWallets(),
};

const mockTransaction = createMockTransaction();

const transactionRow: TransactionRow = {
  id: mockTransaction.id,
  wallet_id: mockTransaction.walletId,
  account_id: mockTransaction.accountId,
  type: mockTransaction.type,
  amount: mockTransaction.amount,
  occurred_at: mockTransaction.occurredAt,
  created_at: mockTransaction.createdAt,
};

const userRow: UserRow = {
  id: 'u1',
  provider: 'google',
  provider_account_id: 'google-sub-1',
  email: 'eli@example.com',
  name: 'אלי',
  created_at: '2026-01-01T00:00:00.000Z',
};

const accountUserRow: AccountUserRow = {
  account_id: mockAccount.id,
  user_id: userRow.id,
  role: 'owner',
  added_at: '2026-01-01T00:00:00.000Z',
};

describe('accountFromRow', () => {
  it('maps an account row to an Account', () => {
    expect(accountFromRow(mockAccountRow)).toEqual(mockAccount);
  });
});

describe('transactionFromRow', () => {
  it('maps a transaction row to a Transaction', () => {
    expect(transactionFromRow(transactionRow)).toEqual(mockTransaction);
  });
});

describe('userFromRow', () => {
  it('maps a user row to a User', () => {
    expect(userFromRow(userRow)).toEqual({
      id: 'u1',
      provider: 'google',
      providerAccountId: 'google-sub-1',
      email: 'eli@example.com',
      name: 'אלי',
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  });
});

describe('accountUserFromRow', () => {
  it('maps an account user row to an AccountUser', () => {
    expect(accountUserFromRow(accountUserRow)).toEqual({
      accountId: mockAccount.id,
      userId: 'u1',
      role: 'owner',
      addedAt: '2026-01-01T00:00:00.000Z',
    });
  });
});

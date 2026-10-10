import {
  accountFromRow,
  accountUserFromRow,
  goalFromRow,
  transactionFromRow,
  userFromRow,
  type AccountUserRow,
  type AccountRow,
  type GoalRow,
  type TransactionRow,
  type UserRow,
} from '../rows';
import { createMockTransaction } from '@/test-utils/mocks/transaction.mocks';
import { createMockWallets } from '@/test-utils/mocks/wallet.mocks';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { GOAL_ENDING } from '@/lib/goal/constants';
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

describe('goalFromRow', () => {
  const mockActiveGoalRow: GoalRow = {
    id: mockGoal.id,
    account_id: mockGoal.accountId,
    name: mockGoal.name,
    amount: mockGoal.amount,
    picture: mockGoal.picture,
    started_at: mockGoal.startedAt,
    ended_at: null,
    ending: null,
  };

  it('maps an active goal row to a Goal with no end', () => {
    expect(goalFromRow(mockActiveGoalRow)).toEqual(mockGoal);
  });

  it('maps an ended goal row to a Goal with when and how it ended', () => {
    const mockEndedAt = '2026-02-01T00:00:00.000Z';

    expect(
      goalFromRow({
        ...mockActiveGoalRow,
        ended_at: mockEndedAt,
        ending: GOAL_ENDING.cancelled,
      })
    ).toEqual({
      ...mockGoal,
      endedAt: mockEndedAt,
      ending: GOAL_ENDING.cancelled,
    });
  });
});

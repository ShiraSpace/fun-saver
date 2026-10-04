/**
 * @jest-environment node
 */
import { GOAL_ENDING } from '@/lib/goal/constants';
import { GoalAlreadyActiveError } from '@/lib/goal/errors';
import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import { createMockAccount } from '@/test-utils/mocks/account.mocks';
import { createMockGoal } from '@/test-utils/mocks/goal.mocks';
import { createMockTransaction } from '@/test-utils/mocks/transaction.mocks';
import { UNIQUE_VIOLATION } from '../errors';
import { withTestDatabase } from './test-database';

const CHECK_VIOLATION = '23514';

describe('PostgresGoals', () => {
  const { store, sql, accountId, goalId, transactionId } = withTestDatabase();
  const mockAccount = createMockAccount({ id: accountId('a') });
  const mockGoal = createMockGoal({
    id: goalId('a'),
    accountId: mockAccount.id,
  });

  beforeEach(async () => {
    await store.insertAccount(mockAccount);
  });

  it('refuses a second active goal for the same account as GoalAlreadyActiveError', async () => {
    await store.insertGoal(mockGoal);

    await expect(
      store.insertGoal(
        createMockGoal({ id: goalId('b'), accountId: mockAccount.id })
      )
    ).rejects.toThrow(GoalAlreadyActiveError);
  });

  it('refuses a goal of zero agorot', async () => {
    await expect(
      store.insertGoal({ ...mockGoal, amount: 0 })
    ).rejects.toMatchObject({ code: CHECK_VIOLATION });
  });

  it('refuses an ending without the moment the goal ended', async () => {
    await store.insertGoal(mockGoal);

    await expect(
      sql`UPDATE goals SET ending = ${GOAL_ENDING.cancelled} WHERE id = ${mockGoal.id}`
    ).rejects.toMatchObject({ code: CHECK_VIOLATION });
  });

  it('fills in when and how the goal ended', async () => {
    const mockEndedAt = '2026-02-01T00:00:00.000Z';
    await store.insertGoal(mockGoal);

    await store.endGoal({
      goalId: mockGoal.id,
      accountId: mockAccount.id,
      endedAt: mockEndedAt,
      ending: GOAL_ENDING.cancelled,
    });

    expect(
      await sql`SELECT ended_at, ending FROM goals WHERE id = ${mockGoal.id}`
    ).toEqual([{ ended_at: mockEndedAt, ending: GOAL_ENDING.cancelled }]);
  });

  it('keeps the goal active and rejects with the database error when the withdrawal cannot be written', async () => {
    const mockWithdrawal = createMockTransaction({
      id: transactionId('withdrawal'),
      accountId: mockAccount.id,
      type: TRANSACTION_TYPE.withdrawal,
    });
    await store.insertGoal(mockGoal);
    await store.insertTransactions([mockWithdrawal]);

    await expect(
      store.insertWithdrawalCompletingGoal(mockWithdrawal, mockGoal.id)
    ).rejects.toMatchObject({ code: UNIQUE_VIOLATION });
    expect(await store.getActiveGoal(mockAccount.id)).toEqual(mockGoal);
  });

  describe('a withdrawal completing the active goal', () => {
    const mockWithdrawal = createMockTransaction({
      id: transactionId('completing'),
      accountId: mockAccount.id,
      type: TRANSACTION_TYPE.withdrawal,
    });

    let wroteWithdrawal: boolean;

    beforeEach(async () => {
      await store.insertGoal(mockGoal);
      wroteWithdrawal = await store.insertWithdrawalCompletingGoal(
        mockWithdrawal,
        mockGoal.id
      );
    });

    it('records the withdrawal', async () => {
      expect(
        await sql`SELECT id FROM transactions WHERE id = ${mockWithdrawal.id}`
      ).toEqual([{ id: mockWithdrawal.id }]);
    });

    it('ends the goal as completed when the withdrawal was made', async () => {
      expect(
        await sql`SELECT ended_at, ending FROM goals WHERE id = ${mockGoal.id}`
      ).toEqual([
        { ended_at: mockWithdrawal.createdAt, ending: GOAL_ENDING.completed },
      ]);
    });

    it('answers that it wrote the withdrawal', () => {
      expect(wroteWithdrawal).toBe(true);
    });
  });

  describe('a withdrawal completing a goal already cancelled', () => {
    const mockWithdrawal = createMockTransaction({
      id: transactionId('too-late'),
      accountId: mockAccount.id,
      type: TRANSACTION_TYPE.withdrawal,
    });
    const mockCancelledAt = '2026-02-01T00:00:00.000Z';

    let wroteWithdrawal: boolean;

    beforeEach(async () => {
      await store.insertGoal(mockGoal);
      await store.endGoal({
        goalId: mockGoal.id,
        accountId: mockAccount.id,
        endedAt: mockCancelledAt,
        ending: GOAL_ENDING.cancelled,
      });
      wroteWithdrawal = await store.insertWithdrawalCompletingGoal(
        mockWithdrawal,
        mockGoal.id
      );
    });

    it('records nothing', async () => {
      expect(
        await sql`SELECT id FROM transactions WHERE id = ${mockWithdrawal.id}`
      ).toEqual([]);
    });

    it('answers that it wrote nothing', () => {
      expect(wroteWithdrawal).toBe(false);
    });

    it('leaves the goal cancelled', async () => {
      expect(
        await sql`SELECT ended_at, ending FROM goals WHERE id = ${mockGoal.id}`
      ).toEqual([{ ended_at: mockCancelledAt, ending: GOAL_ENDING.cancelled }]);
    });
  });
});

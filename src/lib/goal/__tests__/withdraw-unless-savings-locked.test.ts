import { InMemoryStore } from '@/db/memory-store';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { createMockWithdrawal } from '@/test-utils/mocks/transaction.mocks';
import { createMockWallet } from '@/test-utils/mocks/wallet.mocks';
import { GOAL_ENDING } from '../constants';
import { SavingsLockedError } from '../errors';
import { withdrawUnlessSavingsLocked } from '../withdraw-unless-savings-locked';

describe('withdrawUnlessSavingsLocked', () => {
  const mockWithdrawal = createMockWithdrawal(createMockWallet());
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('records the withdrawal as before when there is no goal', async () => {
    await withdrawUnlessSavingsLocked({
      store,
      withdrawal: mockWithdrawal,
      goal: undefined,
      walletBalance: 0,
    });

    expect(await store.listTransactionsByAccount(mockAccount.id)).toEqual([
      mockWithdrawal,
    ]);
  });

  it('refuses with SavingsLockedError and writes nothing while the goal is not reached', async () => {
    await store.insertGoal(mockGoal);

    await expect(
      withdrawUnlessSavingsLocked({
        store,
        withdrawal: mockWithdrawal,
        goal: mockGoal,
        walletBalance: mockGoal.amount - 1,
      })
    ).rejects.toThrow(SavingsLockedError);

    expect(await store.listTransactionsByAccount(mockAccount.id)).toEqual([]);
    expect(await store.getActiveGoal(mockAccount.id)).toEqual(mockGoal);
  });

  it('ends a reached goal with the withdrawal', async () => {
    await store.insertGoal(mockGoal);

    await withdrawUnlessSavingsLocked({
      store,
      withdrawal: mockWithdrawal,
      goal: mockGoal,
      walletBalance: mockGoal.amount,
    });

    expect(await store.listTransactionsByAccount(mockAccount.id)).toEqual([
      mockWithdrawal,
    ]);
    expect(await store.getActiveGoal(mockAccount.id)).toBeUndefined();
  });

  describe('a reached goal cancelled after it was read', () => {
    let refusal: unknown;

    beforeEach(async () => {
      await store.insertGoal(mockGoal);
      await store.endGoal({
        goalId: mockGoal.id,
        accountId: mockAccount.id,
        endedAt: mockGoal.startedAt,
        ending: GOAL_ENDING.cancelled,
      });
      refusal = await withdrawUnlessSavingsLocked({
        store,
        withdrawal: mockWithdrawal,
        goal: mockGoal,
        walletBalance: mockGoal.amount,
      }).catch((error) => error);
    });

    it('refuses with SavingsLockedError', () => {
      expect(refusal).toBeInstanceOf(SavingsLockedError);
    });

    it('records nothing', async () => {
      expect(await store.listTransactionsByAccount(mockAccount.id)).toEqual([]);
    });
  });
});

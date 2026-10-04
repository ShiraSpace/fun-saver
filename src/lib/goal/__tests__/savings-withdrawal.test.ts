import { InMemoryStore } from '@/db/memory-store';
import { mockAccount } from '@/test-utils/mocks/account.mocks';
import { mockGoal } from '@/test-utils/mocks/goal.mocks';
import { createMockWithdrawal } from '@/test-utils/mocks/transaction.mocks';
import { createMockWallet } from '@/test-utils/mocks/wallet.mocks';
import { SavingsLockedError } from '../errors';
import { withdrawFromSavings } from '../savings-withdrawal';

describe('withdrawFromSavings', () => {
  const mockWithdrawal = createMockWithdrawal(createMockWallet());
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  it('records the withdrawal as before when there is no goal', async () => {
    await withdrawFromSavings({
      store,
      withdrawal: mockWithdrawal,
      goal: undefined,
      savingsBalance: 0,
    });

    expect(await store.listTransactionsByAccount(mockAccount.id)).toEqual([
      mockWithdrawal,
    ]);
  });

  it('refuses with SavingsLockedError and writes nothing while the goal is not reached', async () => {
    await store.insertGoal(mockGoal);

    await expect(
      withdrawFromSavings({
        store,
        withdrawal: mockWithdrawal,
        goal: mockGoal,
        savingsBalance: mockGoal.amount - 1,
      })
    ).rejects.toThrow(SavingsLockedError);

    expect(await store.listTransactionsByAccount(mockAccount.id)).toEqual([]);
    expect(await store.getActiveGoal(mockAccount.id)).toEqual(mockGoal);
  });

  it('ends a reached goal with the withdrawal', async () => {
    await store.insertGoal(mockGoal);

    await withdrawFromSavings({
      store,
      withdrawal: mockWithdrawal,
      goal: mockGoal,
      savingsBalance: mockGoal.amount,
    });

    expect(await store.listTransactionsByAccount(mockAccount.id)).toEqual([
      mockWithdrawal,
    ]);
    expect(await store.getActiveGoal(mockAccount.id)).toBeUndefined();
  });
});

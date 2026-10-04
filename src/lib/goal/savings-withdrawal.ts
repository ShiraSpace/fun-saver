import type { DataStore } from '@/db/data-store';
import type { Transaction } from '@/lib/transaction/types';
import { SavingsLockedError } from './errors';
import { goalReached } from './goal-reached';
import type { Goal } from './types';

interface WithdrawFromSavingsParams {
  store: DataStore;
  withdrawal: Transaction;
  goal: Goal | undefined;
  savingsBalance: number;
}

export async function withdrawFromSavings({
  store,
  withdrawal,
  goal,
  savingsBalance,
}: WithdrawFromSavingsParams): Promise<void> {
  if (!goal) {
    await store.insertTransactions([withdrawal]);
    return;
  }

  if (!goalReached(goal, savingsBalance)) {
    throw new SavingsLockedError();
  }

  const wroteWithdrawal = await store.insertWithdrawalCompletingGoal(
    withdrawal,
    goal.id
  );

  if (!wroteWithdrawal) {
    throw new SavingsLockedError();
  }
}

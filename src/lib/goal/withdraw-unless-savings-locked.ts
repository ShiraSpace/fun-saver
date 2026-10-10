import type { DataStore } from '@/db/data-store';
import type { Transaction } from '@/lib/transaction/types';
import { SavingsLockedError } from './errors';
import { goalReached } from './goal-reached';
import type { Goal } from './types';

interface WithdrawUnlessSavingsLockedParams {
  store: DataStore;
  withdrawal: Transaction;
  goal: Goal | undefined;
  walletBalance: number;
}

export async function withdrawUnlessSavingsLocked({
  store,
  withdrawal,
  goal,
  walletBalance,
}: WithdrawUnlessSavingsLockedParams): Promise<void> {
  if (!goal) {
    await store.insertTransactions([withdrawal]);
    return;
  }

  if (!goalReached(goal, walletBalance)) {
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

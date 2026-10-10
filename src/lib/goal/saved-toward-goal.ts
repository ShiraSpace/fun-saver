import type { AccountSummary } from '@/lib/account/types';
import type { WalletSummary } from '@/lib/wallet/types';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { walletNamed } from '@/lib/wallet/wallet-named';
import { withoutAgorot } from '@/lib/money';
import { goalReached } from './goal-reached';
import type { Goal } from './types';

export interface SavedTowardGoal {
  goal: Goal;
  saved: number;
  stillToSave: number;
  reached: boolean;
}

export function savingsLocked(savedTowardGoal?: SavedTowardGoal): boolean {
  return !!savedTowardGoal && !savedTowardGoal.reached;
}

export function savedTowardGoalIn(
  wallet: Pick<WalletSummary, 'name'> | undefined,
  savedTowardGoal: SavedTowardGoal | undefined
): SavedTowardGoal | undefined {
  return wallet?.name === WALLET_NAMES.savings ? savedTowardGoal : undefined;
}

export function savedTowardGoalOf(
  account: AccountSummary
): SavedTowardGoal | undefined {
  const { goal } = account;

  if (!goal) {
    return;
  }

  const savingsBalance =
    walletNamed(account.wallets, WALLET_NAMES.savings)?.balance ?? 0;
  const saved = withoutAgorot(savingsBalance);

  return {
    goal,
    saved,
    stillToSave: Math.max(goal.amount - saved, 0),
    reached: goalReached(goal, savingsBalance),
  };
}

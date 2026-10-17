import type { WalletSummary } from '@/lib/wallet/types';
import { savingsWithoutAgorot, type SavingsWithoutAgorot } from '@/lib/wallet/wallet';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { goalReached } from '@/lib/goal/goal-reached';
import { floorToShekels, shekelsToAgorot } from '@/lib/money';
import { MAX_INTEREST_COINS } from './constants';

type Savings = Pick<WalletSummary, 'balance' | 'interestEarned'>;

export type CollectedInterestCookies = Record<string, string | undefined>;

export interface StoredCollectedInterestParams {
  storedCollectedInterest: string | undefined;
  savings: Savings;
}

export interface CollectedInterestParams {
  savings: Savings;
  collectedInterest: number;
}

export interface CollectInterestParams extends StoredCollectedInterestParams {
  collectedInterest: number;
}

export interface SavingsLessUncollectedInterestParams {
  savings: Savings;
  uncollectedInterest: number;
}

export interface SavedTowardGoalLessUncollectedInterestParams {
  savedTowardGoal?: SavedTowardGoal;
  uncollectedInterest: number;
}

function wholeAgorot(storedCollectedInterest: string | undefined): number | undefined {
  const collectedInterest = Number(storedCollectedInterest);
  const isWholeAgorot =
    Number.isSafeInteger(collectedInterest) &&
    collectedInterest >= 0 &&
    String(collectedInterest) === storedCollectedInterest;

  return isWholeAgorot ? collectedInterest : undefined;
}

function interestSpent(savings: Savings): number {
  return Math.max(savings.interestEarned - savings.balance, 0);
}

export function resolveCollectedInterest({
  storedCollectedInterest,
  savings,
}: StoredCollectedInterestParams): number {
  const collectedInterest = wholeAgorot(storedCollectedInterest);

  if (collectedInterest === undefined || collectedInterest > savings.interestEarned) {
    return savings.interestEarned;
  }

  return Math.max(collectedInterest, interestSpent(savings));
}

export function savingsAtCollectedInterest({
  savings,
  collectedInterest,
}: CollectedInterestParams): Savings {
  const uncollectedInterest = Math.max(savings.interestEarned - collectedInterest, 0);

  return {
    balance: Math.max(savings.balance - uncollectedInterest, 0),
    interestEarned: savings.interestEarned - uncollectedInterest,
  };
}

export function uncollectedInterestOf({
  savings,
  collectedInterest,
}: CollectedInterestParams): number {
  const interestEarnedWithoutAgorot = savingsWithoutAgorot(savings).interestEarned;
  const interestEarnedAtCollectedInterest = savingsWithoutAgorot(
    savingsAtCollectedInterest({ savings, collectedInterest })
  ).interestEarned;

  return interestEarnedWithoutAgorot - interestEarnedAtCollectedInterest;
}

export function interestCoinsOf(uncollectedInterest: number): number[] {
  const shekels = floorToShekels(uncollectedInterest);
  const coinCount = Math.min(shekels, MAX_INTEREST_COINS);
  const evenShare = Math.floor(shekels / coinCount);
  const leftover = shekels % coinCount;

  return Array.from({ length: coinCount }, (_, coinIndex) =>
    shekelsToAgorot(coinIndex < leftover ? evenShare + 1 : evenShare)
  );
}

export function collectInterest({
  storedCollectedInterest,
  savings,
  collectedInterest,
}: CollectInterestParams): number {
  const resolvedCollectedInterest = resolveCollectedInterest({ storedCollectedInterest, savings });

  return Math.min(Math.max(collectedInterest, resolvedCollectedInterest), savings.interestEarned);
}

export function savingsLessUncollectedInterest({
  savings,
  uncollectedInterest,
}: SavingsLessUncollectedInterestParams): SavingsWithoutAgorot {
  const { balance, principal, interestEarned } = savingsWithoutAgorot(savings);

  return {
    balance: balance - uncollectedInterest,
    principal,
    interestEarned: interestEarned - uncollectedInterest,
  };
}

export function savedTowardGoalLessUncollectedInterest({
  savedTowardGoal,
  uncollectedInterest,
}: SavedTowardGoalLessUncollectedInterestParams): SavedTowardGoal | undefined {
  if (!savedTowardGoal) {
    return;
  }

  const saved = savedTowardGoal.saved - uncollectedInterest;
  const isGoalReached =
    savedTowardGoal.isGoalReached &&
    (uncollectedInterest === 0 || goalReached(savedTowardGoal.goal, saved));
  const stillToSave = isGoalReached ? 0 : Math.max(savedTowardGoal.goal.amount - saved, 0);

  return { ...savedTowardGoal, saved, stillToSave, isGoalReached };
}

import type { WalletSummary } from '@/lib/wallet/types';
import { savingsWithoutAgorot } from '@/lib/wallet/wallet';
import { floorToShekels, shekelsToAgorot } from '@/lib/money';
import { MAX_INTEREST_COINS } from './constants';

type Savings = Pick<WalletSummary, 'balance' | 'interestEarned'>;

export interface StoredCollectedInterestParams {
  storedCollectedInterest: string | undefined;
  savings: Savings;
}

export interface CollectedInterestParams<CollectedSavings extends Savings = Savings> {
  savings: CollectedSavings;
  collectedInterest: number;
}

export interface CollectInterestParams extends StoredCollectedInterestParams {
  collectedInterest: number;
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

export function savingsAtCollectedInterest<CollectedSavings extends Savings>({
  savings,
  collectedInterest,
}: CollectedInterestParams<CollectedSavings>): CollectedSavings {
  const uncollected = Math.max(savings.interestEarned - collectedInterest, 0);

  return {
    ...savings,
    balance: Math.max(savings.balance - uncollected, 0),
    interestEarned: savings.interestEarned - uncollected,
  };
}

export function uncollectedInterestOf({
  savings,
  collectedInterest,
}: CollectedInterestParams): number {
  const interestEarnedShown = savingsWithoutAgorot(savings).interestEarned;
  const interestEarnedCollected = savingsWithoutAgorot(
    savingsAtCollectedInterest({ savings, collectedInterest })
  ).interestEarned;

  return interestEarnedShown - interestEarnedCollected;
}

export function interestCoinsOf(uncollectedInterest: number): number[] {
  const shekels = floorToShekels(uncollectedInterest);
  const coinCount = Math.min(shekels, MAX_INTEREST_COINS);

  return Array.from({ length: coinCount }, (_, coinIndex) => {
    const evenShare = Math.floor(shekels / coinCount);
    const getsLeftover = coinIndex < shekels % coinCount;

    return shekelsToAgorot(getsLeftover ? evenShare + 1 : evenShare);
  });
}

export function collectInterest({
  storedCollectedInterest,
  savings,
  collectedInterest,
}: CollectInterestParams): number {
  const storedOrResolved = resolveCollectedInterest({ storedCollectedInterest, savings });

  return Math.min(Math.max(collectedInterest, storedOrResolved), savings.interestEarned);
}

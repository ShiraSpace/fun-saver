'use client';

import { useState } from 'react';
import type { InterestCoin } from './InterestCoins';
import { COIN_SPACE_SETTLES_AFTER_MS } from './InterestCoins/constants';

const NO_WAIT_MS = 0;

interface CelebrationWaitParams {
  isGoalReached: boolean;
  interestCoins: InterestCoin[];
}

interface LastSeen {
  wasGoalReached: boolean;
  coinsLeft: number;
  celebrationWaitMs: number;
}

function celebrationWaitAfter(lastSeen: LastSeen, now: CelebrationWaitParams): number {
  const isGoalJustReached = now.isGoalReached && !lastSeen.wasGoalReached;
  const coinsLeft = now.interestCoins.length;
  const isReachedByTheLastCoin = coinsLeft === 0 && coinsLeft < lastSeen.coinsLeft;

  if (!isGoalJustReached) {
    return lastSeen.celebrationWaitMs;
  }

  return isReachedByTheLastCoin ? COIN_SPACE_SETTLES_AFTER_MS : NO_WAIT_MS;
}

export function useCelebrationWait(now: CelebrationWaitParams): number {
  const [lastSeen, setLastSeen] = useState<LastSeen>({
    wasGoalReached: now.isGoalReached,
    coinsLeft: now.interestCoins.length,
    celebrationWaitMs: NO_WAIT_MS,
  });
  const celebrationWaitMs = celebrationWaitAfter(lastSeen, now);
  const hasChanged =
    now.isGoalReached !== lastSeen.wasGoalReached ||
    now.interestCoins.length !== lastSeen.coinsLeft;

  if (hasChanged) {
    setLastSeen({
      wasGoalReached: now.isGoalReached,
      coinsLeft: now.interestCoins.length,
      celebrationWaitMs,
    });
  }

  return celebrationWaitMs;
}

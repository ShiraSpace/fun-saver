'use client';

import { useState } from 'react';
import type { InterestCoin } from './InterestCoins';
import { COIN_SPACE_SETTLES_AFTER_MS } from './InterestCoins/constants';

const NO_WAIT_MS = 0;

interface CelebrationWaitParams {
  isGoalReached: boolean;
  interestCoins: InterestCoin[];
}

export function useCelebrationWait({
  isGoalReached,
  interestCoins,
}: CelebrationWaitParams): number {
  const [celebrationWaitMs, setCelebrationWaitMs] = useState(
    isGoalReached ? NO_WAIT_MS : undefined
  );

  if (isGoalReached && celebrationWaitMs === undefined) {
    const reachedByTheLastCoin = interestCoins.length === 0;
    setCelebrationWaitMs(reachedByTheLastCoin ? COIN_SPACE_SETTLES_AFTER_MS : NO_WAIT_MS);
  }

  return celebrationWaitMs ?? NO_WAIT_MS;
}

'use client';

import { useEffect, useState } from 'react';
import { canAnimate } from '@/theme/motion';
import type { InterestCoin } from './InterestCoins';
import { COIN_SPACE_SETTLES_AFTER_MS } from './InterestCoins/constants';

interface GoalReachedParams {
  isGoalReached: boolean;
  interestCoins: InterestCoin[];
}

interface LastSeen {
  wasGoalReached: boolean;
  coinsLeft: number;
}

function isReachedByTheLastCoin(lastSeen: LastSeen, now: GoalReachedParams): boolean {
  const coinsLeft = now.interestCoins.length;
  const isGoalJustReached = now.isGoalReached && !lastSeen.wasGoalReached;

  return isGoalJustReached && coinsLeft === 0 && coinsLeft < lastSeen.coinsLeft;
}

export function useGoalReachedOnceTheCoinsSettle(now: GoalReachedParams): boolean {
  const [lastSeen, setLastSeen] = useState<LastSeen>({
    wasGoalReached: now.isGoalReached,
    coinsLeft: now.interestCoins.length,
  });
  const [isWaitingForTheCoins, setIsWaitingForTheCoins] = useState(false);
  const coinsLeft = now.interestCoins.length;

  if (now.isGoalReached !== lastSeen.wasGoalReached || coinsLeft !== lastSeen.coinsLeft) {
    setIsWaitingForTheCoins(isReachedByTheLastCoin(lastSeen, now) && canAnimate());
    setLastSeen({ wasGoalReached: now.isGoalReached, coinsLeft });
  }

  useEffect(() => {
    if (!isWaitingForTheCoins) {
      return;
    }

    const coinsSettle = setTimeout(
      () => setIsWaitingForTheCoins(false),
      COIN_SPACE_SETTLES_AFTER_MS
    );

    return (): void => clearTimeout(coinsSettle);
  }, [isWaitingForTheCoins]);

  return now.isGoalReached && !isWaitingForTheCoins;
}

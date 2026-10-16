'use client';

import { useEffect, useEffectEvent, useState } from 'react';
import type { WalletSummary } from '@/lib/wallet/types';
import {
  collectInterest,
  interestCoinsOf,
  resolveCollectedInterest,
  uncollectedInterestOf,
} from '@/lib/interest/collected-interest';
import { useCollectedInterest } from '@/components/Home/collected-interest-context';
import type { InterestCoin } from './InterestCoins';

interface InterestCoinsParams {
  savings: WalletSummary;
  accountId: string;
}

interface Visit {
  collectedInterest: number;
  interestCoins: InterestCoin[];
}

interface VisitInterestCoins {
  interestCoins: InterestCoin[];
  uncollectedInterest: number;
  collect: (place: number) => void;
}

function visitStartingAt(savings: WalletSummary, collectedInterest: number): Visit {
  const uncollectedInterest = uncollectedInterestOf({ savings, collectedInterest });

  return {
    collectedInterest,
    interestCoins: interestCoinsOf(uncollectedInterest).map((amount, place) => ({ place, amount })),
  };
}

function visitAfterCollecting(visit: Visit, place: number): Visit {
  const coin = visit.interestCoins.find((interestCoin) => interestCoin.place === place);

  if (!coin) {
    return visit;
  }

  return {
    collectedInterest: visit.collectedInterest + coin.amount,
    interestCoins: visit.interestCoins.filter((interestCoin) => interestCoin !== coin),
  };
}

export function useInterestCoins({ savings, accountId }: InterestCoinsParams): VisitInterestCoins {
  const { storedCollectedInterest, readStoredCollectedInterest, saveCollectedInterest } =
    useCollectedInterest(accountId);
  const [visit, setVisit] = useState((): Visit =>
    visitStartingAt(savings, resolveCollectedInterest({ storedCollectedInterest, savings }))
  );

  const saveVisitMark = useEffectEvent((collectedInterest: number): void => {
    const storedNow = readStoredCollectedInterest();
    saveCollectedInterest(
      collectInterest({ storedCollectedInterest: storedNow, savings, collectedInterest })
    );
  });

  useEffect((): void => saveVisitMark(visit.collectedInterest), [visit.collectedInterest]);

  const collect = (place: number): void =>
    setVisit((current) => visitAfterCollecting(current, place));

  return {
    interestCoins: visit.interestCoins,
    uncollectedInterest: uncollectedInterestOf({
      savings,
      collectedInterest: visit.collectedInterest,
    }),
    collect,
  };
}

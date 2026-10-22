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
  interestNotLanded: number;
  collect: (place: number) => void;
  land: (place: number) => void;
}

function visitStartingAt(savings: WalletSummary, collectedInterest: number): Visit {
  const uncollectedInterest = uncollectedInterestOf({ savings, collectedInterest });

  return {
    collectedInterest,
    interestCoins: interestCoinsOf(uncollectedInterest).map((amount, place) => ({
      place,
      amount,
      isDropping: false,
    })),
  };
}

function coinAt(visit: Visit, place: number): InterestCoin | undefined {
  return visit.interestCoins.find((interestCoin) => interestCoin.place === place);
}

function interestStillFalling(visit: Visit): number {
  return visit.interestCoins
    .filter((interestCoin) => interestCoin.isDropping)
    .reduce((dropping, interestCoin) => dropping + interestCoin.amount, 0);
}

function visitAfterCollecting(visit: Visit, place: number): Visit {
  const coin = coinAt(visit, place);

  if (!coin || coin.isDropping) {
    return visit;
  }

  return {
    collectedInterest: visit.collectedInterest + coin.amount,
    interestCoins: visit.interestCoins.map((interestCoin) =>
      interestCoin === coin ? { ...coin, isDropping: true } : interestCoin
    ),
  };
}

function visitAfterLanding(visit: Visit, place: number): Visit {
  const coin = coinAt(visit, place);

  if (!coin?.isDropping) {
    return visit;
  }

  return {
    ...visit,
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
  const land = (place: number): void => setVisit((current) => visitAfterLanding(current, place));

  return {
    interestCoins: visit.interestCoins,
    interestNotLanded: uncollectedInterestOf({
      savings,
      collectedInterest: visit.collectedInterest - interestStillFalling(visit),
    }),
    collect,
    land,
  };
}

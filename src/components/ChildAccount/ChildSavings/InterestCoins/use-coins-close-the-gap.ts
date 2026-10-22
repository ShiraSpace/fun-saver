'use client';

import { RefCallback, useLayoutEffect, useRef } from 'react';
import { canAnimate } from '@/theme/motion';
import { COINS_CLOSE_THE_GAP } from './constants';
import type { InterestCoin } from './InterestCoins';

type CoinSpots = Map<number, number>;

function slideFrom(coin: HTMLElement, shift: number): void {
  coin.animate(
    [{ transform: `translateX(${shift}px)` }, { transform: COINS_CLOSE_THE_GAP.inPlace }],
    { duration: COINS_CLOSE_THE_GAP.durationMs, easing: COINS_CLOSE_THE_GAP.easing }
  );
}

export function useCoinsCloseTheGap(
  interestCoins: InterestCoin[]
): (place: number) => RefCallback<HTMLElement> {
  const coinElements = useRef(new Map<number, HTMLElement>());
  const coinSpotsBefore = useRef<CoinSpots>(new Map());

  useLayoutEffect(() => {
    const coinSpotsNow: CoinSpots = new Map();

    coinElements.current.forEach((coin, place) => {
      const spotNow = coin.getBoundingClientRect().left;
      const spotBefore = coinSpotsBefore.current.get(place);

      coinSpotsNow.set(place, spotNow);

      if (spotBefore !== undefined && spotBefore !== spotNow && canAnimate()) {
        slideFrom(coin, spotBefore - spotNow);
      }
    });

    coinSpotsBefore.current = coinSpotsNow;
  }, [interestCoins]);

  return (place) => (coin) => {
    if (coin) {
      coinElements.current.set(place, coin);
    }

    return (): void => {
      coinElements.current.delete(place);
    };
  };
}

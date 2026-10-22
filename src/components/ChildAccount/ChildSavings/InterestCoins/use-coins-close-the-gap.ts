'use client';

import { RefCallback, useLayoutEffect, useRef } from 'react';
import { canAnimate } from '@/theme/motion';
import { COINS_CLOSE_THE_GAP } from './constants';
import type { InterestCoin } from './InterestCoins';

type WhereCoinsStand = Map<number, number>;

function slideOverFrom(coin: HTMLElement, howFarItMoved: number): void {
  coin.animate(
    [{ transform: `translateX(${howFarItMoved}px)` }, { transform: COINS_CLOSE_THE_GAP.inPlace }],
    {
      duration: COINS_CLOSE_THE_GAP.durationMs,
      easing: COINS_CLOSE_THE_GAP.easing,
      composite: 'add',
    }
  );
}

function keepFallingWhereItWas(coin: HTMLElement, howFarItMoved: number): void {
  const whereItWas = `${howFarItMoved}px 0`;

  coin.animate([{ translate: whereItWas }, { translate: whereItWas }], {
    fill: 'forwards',
    composite: 'add',
  });
}

function followTheRow(coin: HTMLElement, howFarItMoved: number, isDropping: boolean): void {
  if (isDropping) {
    keepFallingWhereItWas(coin, howFarItMoved);
    return;
  }

  slideOverFrom(coin, howFarItMoved);
}

export function useCoinsCloseTheGap(
  interestCoins: InterestCoin[]
): (place: number) => RefCallback<HTMLElement> {
  const coinButtons = useRef(new Map<number, HTMLElement>());
  const whereCoinsStood = useRef<WhereCoinsStand>(new Map());

  useLayoutEffect(() => {
    const whereCoinsStandNow: WhereCoinsStand = new Map();

    interestCoins.forEach(({ place, isDropping }) => {
      const coin = coinButtons.current.get(place);
      const stoodAt = whereCoinsStood.current.get(place);

      if (!coin) {
        return;
      }

      const standsAt = coin.offsetLeft;

      whereCoinsStandNow.set(place, standsAt);

      if (stoodAt !== undefined && stoodAt !== standsAt && canAnimate()) {
        followTheRow(coin, stoodAt - standsAt, isDropping);
      }
    });

    whereCoinsStood.current = whereCoinsStandNow;
  }, [interestCoins]);

  return (place) => (coin) => {
    if (coin) {
      coinButtons.current.set(place, coin);
    }

    return (): void => {
      coinButtons.current.delete(place);
    };
  };
}

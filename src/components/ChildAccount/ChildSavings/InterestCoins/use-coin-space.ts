'use client';

import { RefObject, useLayoutEffect, useState } from 'react';
import { canAnimate } from '@/theme/motion';
import { COIN_SPACE_CLOSE } from './constants';

function closeSlowly(coinSpace: HTMLElement): Animation {
  const { waitForTheWiggleMs, durationMs, easing, closed } = COIN_SPACE_CLOSE;

  return coinSpace.animate(
    [
      {
        height: `${coinSpace.offsetHeight}px`,
        marginBottom: getComputedStyle(coinSpace).marginBottom,
      },
      { height: closed, marginBottom: closed },
    ],
    { delay: waitForTheWiggleMs, duration: durationMs, easing, fill: 'both' }
  );
}

export function useCoinSpace(coinSpace: RefObject<HTMLElement | null>, hasCoins: boolean): boolean {
  const [hadCoinsWhenTheVisitBegan] = useState(hasCoins);
  const [isSpaceClosed, setIsSpaceClosed] = useState(false);

  useLayoutEffect(() => {
    const space = coinSpace.current;

    if (hasCoins || !space || !canAnimate()) {
      return;
    }

    const closing = closeSlowly(space);
    closing.onfinish = (): void => setIsSpaceClosed(true);

    return (): void => closing.cancel();
  }, [hasCoins, coinSpace]);

  return hasCoins || (hadCoinsWhenTheVisitBegan && !isSpaceClosed && canAnimate());
}

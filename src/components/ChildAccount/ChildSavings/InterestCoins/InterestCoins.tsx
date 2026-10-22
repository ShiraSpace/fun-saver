'use client';

import { JSX, RefObject, useRef } from 'react';
import { InterestCoinButton } from './InterestCoinButton';
import { useCoinsCloseTheGap } from './use-coins-close-the-gap';
import { useCoinSpace } from './use-coin-space';
import { INTEREST_COINS_COPY, INTEREST_COINS_TEST_IDS, TAPPABLE_COIN_SELECTOR } from './constants';
import { CoinRow, CoinSpace, TapTheCoins } from './InterestCoins.styles';

export interface InterestCoin {
  place: number;
  amount: number;
  isDropping: boolean;
}

interface InterestCoinsProps {
  interestCoins: InterestCoin[];
  onCollect: (place: number, tappedCoin: HTMLElement) => void;
  whereFocusGoesLast: RefObject<HTMLElement | null>;
}

function nextFocus(tappableCoins: HTMLElement[], tappedCoin: HTMLElement): HTMLElement | undefined {
  const tappedIndex = tappableCoins.indexOf(tappedCoin);

  return tappableCoins[tappedIndex + 1] ?? tappableCoins[tappedIndex - 1];
}

export function InterestCoins({
  interestCoins,
  onCollect,
  whereFocusGoesLast,
}: InterestCoinsProps): JSX.Element | null {
  const coinSpace = useRef<HTMLDivElement>(null);
  const coinRow = useRef<HTMLDivElement>(null);
  const hasCoins = interestCoins.length > 0;
  const isSpaceOpen = useCoinSpace(coinSpace, hasCoins);
  const coinElementAt = useCoinsCloseTheGap(interestCoins);

  function collect(place: number, tappedCoin: HTMLElement): void {
    const tappableCoins = [
      ...(coinRow.current?.querySelectorAll<HTMLElement>(TAPPABLE_COIN_SELECTOR) ?? []),
    ];
    (nextFocus(tappableCoins, tappedCoin) ?? whereFocusGoesLast.current)?.focus();
    onCollect(place, tappedCoin);
  }

  if (!hasCoins && !isSpaceOpen) {
    return null;
  }

  const tapTheCoins = hasCoins && INTEREST_COINS_COPY.tapTheCoins;

  const coinButtons = interestCoins.map((interestCoin) => (
    <InterestCoinButton
      key={interestCoin.place}
      ref={coinElementAt(interestCoin.place)}
      amount={interestCoin.amount}
      isDropping={interestCoin.isDropping}
      onTap={(tappedCoin): void => collect(interestCoin.place, tappedCoin)}
    />
  ));

  return (
    <CoinSpace ref={coinSpace}>
      <TapTheCoins data-testid={INTEREST_COINS_TEST_IDS.copy}>{tapTheCoins}</TapTheCoins>
      <CoinRow ref={coinRow}>{coinButtons}</CoinRow>
    </CoinSpace>
  );
}

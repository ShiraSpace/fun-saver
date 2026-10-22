'use client';

import { JSX, RefObject, useRef } from 'react';
import { InterestCoinButton } from './InterestCoinButton';
import { INTEREST_COINS_COPY, INTEREST_COINS_TEST_IDS, TAPPABLE_COIN_SELECTOR } from './constants';
import { CoinRow, TapTheCoins } from './InterestCoins.styles';

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
  const coinRow = useRef<HTMLDivElement>(null);

  function collect(place: number, tappedCoin: HTMLElement): void {
    const tappableCoins = [
      ...(coinRow.current?.querySelectorAll<HTMLElement>(TAPPABLE_COIN_SELECTOR) ?? []),
    ];
    (nextFocus(tappableCoins, tappedCoin) ?? whereFocusGoesLast.current)?.focus();
    onCollect(place, tappedCoin);
  }

  if (interestCoins.length === 0) {
    return null;
  }

  const coinButtons = interestCoins.map((interestCoin) => (
    <InterestCoinButton
      key={interestCoin.place}
      amount={interestCoin.amount}
      isDropping={interestCoin.isDropping}
      onTap={(tappedCoin): void => collect(interestCoin.place, tappedCoin)}
    />
  ));

  return (
    <>
      <TapTheCoins data-testid={INTEREST_COINS_TEST_IDS.copy}>
        {INTEREST_COINS_COPY.tapTheCoins}
      </TapTheCoins>
      <CoinRow ref={coinRow}>{coinButtons}</CoinRow>
    </>
  );
}

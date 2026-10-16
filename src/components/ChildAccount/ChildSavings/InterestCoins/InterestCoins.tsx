'use client';

import { JSX, RefObject, useRef } from 'react';
import { InterestCoinButton } from './InterestCoinButton';
import { INTEREST_COINS_COPY, INTEREST_COINS_TEST_IDS } from './constants';
import { CoinRow, TapTheCoins } from './InterestCoins.styles';

export interface InterestCoin {
  place: number;
  amount: number;
}

interface InterestCoinsProps {
  interestCoins: InterestCoin[];
  onCollect: (place: number) => void;
  whereFocusGoesLast: RefObject<HTMLElement | null>;
}

function nextFocus(tappableCoins: HTMLElement[], tappedIndex: number): HTMLElement | undefined {
  return tappableCoins[tappedIndex + 1] ?? tappableCoins[tappedIndex - 1];
}

export function InterestCoins({
  interestCoins,
  onCollect,
  whereFocusGoesLast,
}: InterestCoinsProps): JSX.Element | null {
  const coinRow = useRef<HTMLDivElement>(null);

  function collect(place: number, tappedIndex: number): void {
    const tappableCoins = [...(coinRow.current?.querySelectorAll<HTMLElement>('button') ?? [])];
    (nextFocus(tappableCoins, tappedIndex) ?? whereFocusGoesLast.current)?.focus();
    onCollect(place);
  }

  if (interestCoins.length === 0) {
    return null;
  }

  const coinButtons = interestCoins.map((interestCoin, coinIndex) => (
    <InterestCoinButton
      key={interestCoin.place}
      amount={interestCoin.amount}
      onTap={(): void => collect(interestCoin.place, coinIndex)}
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

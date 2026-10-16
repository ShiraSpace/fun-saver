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

function nextFocus(coinButtons: HTMLButtonElement[], tappedIndex: number): HTMLElement | undefined {
  return coinButtons[tappedIndex + 1] ?? coinButtons[tappedIndex - 1];
}

export function InterestCoins({
  interestCoins,
  onCollect,
  whereFocusGoesLast,
}: InterestCoinsProps): JSX.Element | null {
  const coinRow = useRef<HTMLDivElement>(null);

  function collect(place: number, tappedIndex: number): void {
    const coinButtons = [...(coinRow.current?.querySelectorAll('button') ?? [])];
    (nextFocus(coinButtons, tappedIndex) ?? whereFocusGoesLast.current)?.focus();
    onCollect(place);
  }

  if (interestCoins.length === 0) {
    return null;
  }

  return (
    <>
      <TapTheCoins data-testid={INTEREST_COINS_TEST_IDS.copy}>
        {INTEREST_COINS_COPY.tapTheCoins}
      </TapTheCoins>
      <CoinRow ref={coinRow}>
        {interestCoins.map((interestCoin, coinIndex) => (
          <InterestCoinButton
            key={interestCoin.place}
            amount={interestCoin.amount}
            onTap={(): void => collect(interestCoin.place, coinIndex)}
          />
        ))}
      </CoinRow>
    </>
  );
}

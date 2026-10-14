'use client';

import { JSX, RefObject, useRef } from 'react';
import { floorToShekels } from '@/lib/money';
import { Money } from '@/components/Money';
import { MONEY_COPY } from '@/components/Money/constants';
import { INTEREST_COINS_COPY, INTEREST_COINS_TEST_IDS } from './constants';
import { CoinAmount, CoinButton, CoinRow, TapTheCoins } from './InterestCoins.styles';

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
}: InterestCoinsProps): JSX.Element {
  const coinRow = useRef<HTMLDivElement>(null);

  function collect(place: number, tappedIndex: number): void {
    const coinButtons = [...(coinRow.current?.querySelectorAll('button') ?? [])];
    (nextFocus(coinButtons, tappedIndex) ?? whereFocusGoesLast.current)?.focus();
    onCollect(place);
  }

  return (
    <>
      <TapTheCoins data-testid={INTEREST_COINS_TEST_IDS.copy}>
        {interestCoins.length > 0 && INTEREST_COINS_COPY.tapTheCoins}
      </TapTheCoins>
      <CoinRow ref={coinRow}>
        {interestCoins.map(({ place, amount }, coinIndex) => (
          <CoinButton
            key={place}
            type="button"
            aria-label={INTEREST_COINS_COPY.coinLabel(floorToShekels(amount))}
            data-testid={INTEREST_COINS_TEST_IDS.coin}
            onClick={(): void => collect(place, coinIndex)}
          >
            {MONEY_COPY.currencySign}
            <CoinAmount dir="ltr">
              {INTEREST_COINS_COPY.earnedSign}
              <Money
                amountAgorot={amount}
                testId={INTEREST_COINS_TEST_IDS.amount}
                fullSizeCurrency
              />
            </CoinAmount>
          </CoinButton>
        ))}
      </CoinRow>
    </>
  );
}

import { JSX } from 'react';
import { floorToShekels } from '@/lib/money';
import { Money } from '@/components/Money';
import { MONEY_COPY } from '@/components/Money/constants';
import { INTEREST_COIN_BUTTON_COPY, INTEREST_COIN_BUTTON_TEST_IDS } from './constants';
import { CoinAmount, CoinButton } from './InterestCoinButton.styles';

interface InterestCoinButtonProps {
  amount: number;
  onTap: () => void;
}

export function InterestCoinButton({ amount, onTap }: InterestCoinButtonProps): JSX.Element {
  return (
    <CoinButton
      type="button"
      aria-label={INTEREST_COIN_BUTTON_COPY.coinLabel(floorToShekels(amount))}
      data-testid={INTEREST_COIN_BUTTON_TEST_IDS.coin}
      onClick={onTap}
    >
      {MONEY_COPY.currencySign}
      <CoinAmount dir="ltr">
        {INTEREST_COIN_BUTTON_COPY.earnedSign}
        <Money
          amountAgorot={amount}
          testId={INTEREST_COIN_BUTTON_TEST_IDS.amount}
          fullSizeCurrency
        />
      </CoinAmount>
    </CoinButton>
  );
}

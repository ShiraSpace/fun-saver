import { JSX, Ref } from 'react';
import { floorToShekels } from '@/lib/money';
import { Money } from '@/components/Money';
import { MONEY_COPY } from '@/components/Money/constants';
import { INTEREST_COIN_BUTTON_COPY, INTEREST_COIN_BUTTON_TEST_IDS } from './constants';
import { CoinAmount, CoinButton } from './InterestCoinButton.styles';

interface InterestCoinButtonProps {
  amount: number;
  isDropping: boolean;
  onTap: (tappedCoin: HTMLButtonElement) => void;
  ref?: Ref<HTMLButtonElement>;
}

export function InterestCoinButton({
  amount,
  isDropping,
  onTap,
  ref,
}: InterestCoinButtonProps): JSX.Element {
  const coinLabel = INTEREST_COIN_BUTTON_COPY.coinLabel(floorToShekels(amount));

  return (
    <CoinButton
      ref={ref}
      type="button"
      aria-label={coinLabel}
      data-testid={INTEREST_COIN_BUTTON_TEST_IDS.coin}
      disabled={isDropping}
      onClick={(event): void => onTap(event.currentTarget)}
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

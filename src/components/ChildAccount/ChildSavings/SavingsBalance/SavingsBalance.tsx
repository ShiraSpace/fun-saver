import { JSX, Ref } from 'react';
import { Money } from '@/components/Money';
import { BalanceTwinkles } from './BalanceTwinkles';
import { SAVINGS_BALANCE_TEST_IDS } from './constants';
import { AnnouncedBalance, Balance, ShownBalance } from './SavingsBalance.styles';

interface SavingsBalanceProps {
  balance: number;
  celebrating?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function SavingsBalance({
  balance,
  celebrating = false,
  ref,
}: SavingsBalanceProps): JSX.Element {
  const twinkles = celebrating && <BalanceTwinkles />;

  return (
    <Balance ref={ref} tabIndex={-1}>
      <ShownBalance
        aria-hidden
        celebrating={celebrating}
        data-testid={SAVINGS_BALANCE_TEST_IDS.shown}
      >
        <Money amountAgorot={balance} testId={SAVINGS_BALANCE_TEST_IDS.balance} />
      </ShownBalance>
      <AnnouncedBalance aria-live="polite" aria-atomic>
        <Money amountAgorot={balance} testId={SAVINGS_BALANCE_TEST_IDS.announcedBalance} />
      </AnnouncedBalance>
      {twinkles}
    </Balance>
  );
}

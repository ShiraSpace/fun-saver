import { JSX, Ref } from 'react';
import { Money } from '@/components/Money';
import { useCountUp } from '@/hooks/use-count-up';
import { SAVINGS_ROLL_UP } from '../constants';
import { SAVINGS_BALANCE_TEST_IDS } from './constants';
import { AnnouncedBalance, Balance } from './SavingsBalance.styles';

interface SavingsBalanceProps {
  balance: number;
  ref?: Ref<HTMLDivElement>;
}

export function SavingsBalance({ balance, ref }: SavingsBalanceProps): JSX.Element {
  const balanceOnScreen = useCountUp({ startAt: balance, to: balance, timing: SAVINGS_ROLL_UP });

  return (
    <Balance ref={ref} tabIndex={-1}>
      <span aria-hidden>
        <Money amountAgorot={balanceOnScreen} testId={SAVINGS_BALANCE_TEST_IDS.balance} />
      </span>
      <AnnouncedBalance aria-live="polite" aria-atomic>
        <Money amountAgorot={balance} testId={SAVINGS_BALANCE_TEST_IDS.announcedBalance} />
      </AnnouncedBalance>
    </Balance>
  );
}

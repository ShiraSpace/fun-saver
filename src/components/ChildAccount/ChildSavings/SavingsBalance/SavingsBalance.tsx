import { JSX, Ref } from 'react';
import { Money } from '@/components/Money';
import { SAVINGS_BALANCE_TEST_IDS } from './constants';
import { AnnouncedBalance, Balance } from './SavingsBalance.styles';

interface SavingsBalanceProps {
  balance: number;
  ref?: Ref<HTMLDivElement>;
}

export function SavingsBalance({ balance, ref }: SavingsBalanceProps): JSX.Element {
  return (
    <Balance ref={ref} tabIndex={-1}>
      <span aria-hidden>
        <Money amountAgorot={balance} testId={SAVINGS_BALANCE_TEST_IDS.balance} />
      </span>
      <AnnouncedBalance aria-live="polite">
        <Money amountAgorot={balance} testId={SAVINGS_BALANCE_TEST_IDS.announcedBalance} />
      </AnnouncedBalance>
    </Balance>
  );
}

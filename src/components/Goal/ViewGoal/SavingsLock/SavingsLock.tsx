import { JSX } from 'react';
import { GOAL_COPY } from '../../constants';
import { SAVINGS_LOCK_COPY, SAVINGS_LOCK_TEST_IDS } from './constants';
import { Label } from './SavingsLock.styles';

interface SavingsLockProps {
  reached: boolean;
}

export function SavingsLock({ reached }: SavingsLockProps): JSX.Element {
  return (
    <Label reached={reached} data-testid={SAVINGS_LOCK_TEST_IDS.label}>
      {reached ? SAVINGS_LOCK_COPY.savingsOpen : GOAL_COPY.savingsLocked}
    </Label>
  );
}

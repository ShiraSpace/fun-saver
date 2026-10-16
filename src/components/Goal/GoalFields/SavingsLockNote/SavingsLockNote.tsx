import { JSX } from 'react';
import { goalReached } from '@/lib/goal/goal-reached';
import { shekelsToAgorot } from '@/lib/money';
import { SAVINGS_LOCK_NOTE_COPY, SAVINGS_LOCK_NOTE_TEST_IDS } from './constants';
import { Note } from './SavingsLockNote.styles';

interface SavingsLockNoteProps {
  goalName: string;
  amountShekels: number;
  savingsBalance: number;
}

export function SavingsLockNote({
  goalName,
  amountShekels,
  savingsBalance,
}: SavingsLockNoteProps): JSX.Element {
  const isGoalReached =
    amountShekels > 0 && goalReached({ amount: shekelsToAgorot(amountShekels) }, savingsBalance);
  const icon = isGoalReached ? SAVINGS_LOCK_NOTE_COPY.reachedIcon : SAVINGS_LOCK_NOTE_COPY.lockIcon;
  const text = isGoalReached
    ? SAVINGS_LOCK_NOTE_COPY.reached(goalName.trim())
    : SAVINGS_LOCK_NOTE_COPY.locked(amountShekels);

  return (
    <Note isGoalReached={isGoalReached} data-testid={SAVINGS_LOCK_NOTE_TEST_IDS.note}>
      <span aria-hidden="true">{icon}</span>
      <span>{text}</span>
    </Note>
  );
}

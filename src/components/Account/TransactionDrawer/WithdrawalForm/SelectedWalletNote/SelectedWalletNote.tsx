import { JSX } from 'react';
import { agorotToShekels } from '@/lib/money';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { WithdrawalAlert } from '../WithdrawalAlert';
import { WITHDRAWAL_FORM_COPY, WITHDRAWAL_FORM_TEST_IDS } from '../constants';
import { GoalCompletionNote } from './SelectedWalletNote.styles';

interface SelectedWalletNoteProps {
  isSavingsLocked: boolean;
  completesGoal: boolean;
  savedTowardGoal?: SavedTowardGoal;
  isOverdraft: boolean;
  hasError: boolean;
  selectedBalance: number;
}

export function SelectedWalletNote({
  isSavingsLocked,
  completesGoal,
  savedTowardGoal,
  isOverdraft,
  hasError,
  selectedBalance,
}: SelectedWalletNoteProps): JSX.Element | null {
  if (isSavingsLocked) {
    return null;
  }

  if (completesGoal && savedTowardGoal) {
    return (
      <GoalCompletionNote data-testid={WITHDRAWAL_FORM_TEST_IDS.completesGoal}>
        {WITHDRAWAL_FORM_COPY.completesGoal(savedTowardGoal.goal.name)}
      </GoalCompletionNote>
    );
  }

  return (
    <WithdrawalAlert
      isOverdraft={isOverdraft}
      hasError={hasError}
      balanceShekels={agorotToShekels(selectedBalance)}
    />
  );
}

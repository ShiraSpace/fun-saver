import { JSX } from 'react';
import { agorotToShekels } from '@/lib/money';
import { REQUEST_STATE } from '@/lib/request-state';
import type { WithdrawalFormState } from '../../use-withdrawal-form';
import { WithdrawalAlert } from '../WithdrawalAlert';
import { WITHDRAWAL_FORM_COPY, WITHDRAWAL_FORM_TEST_IDS } from '../constants';
import { GoalCompletionNote } from './SelectedWalletNote.styles';

interface SelectedWalletNoteProps {
  form: Pick<
    WithdrawalFormState,
    | 'savingsLockedFor'
    | 'goalToComplete'
    | 'isOverdraft'
    | 'requestState'
    | 'selectedBalance'
  >;
}

export function SelectedWalletNote({
  form,
}: SelectedWalletNoteProps): JSX.Element | null {
  if (form.savingsLockedFor) {
    return null;
  }

  const hasError = form.requestState === REQUEST_STATE.failed;

  if (form.goalToComplete && !form.isOverdraft && !hasError) {
    return (
      <GoalCompletionNote data-testid={WITHDRAWAL_FORM_TEST_IDS.completesGoal}>
        {WITHDRAWAL_FORM_COPY.completesGoal(form.goalToComplete.name)}
      </GoalCompletionNote>
    );
  }

  return (
    <WithdrawalAlert
      isOverdraft={form.isOverdraft}
      hasError={hasError}
      balanceShekels={agorotToShekels(form.selectedBalance)}
    />
  );
}

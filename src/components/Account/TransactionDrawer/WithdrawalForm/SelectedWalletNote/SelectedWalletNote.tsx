import { JSX } from 'react';
import { agorotToShekels } from '@/lib/money';
import { REQUEST_STATE } from '@/lib/request-state';
import type { WithdrawalFormState } from '../../use-withdrawal-form';
import { WithdrawalAlert } from '../WithdrawalAlert';
import { WITHDRAWAL_FORM_COPY, WITHDRAWAL_FORM_TEST_IDS } from '../constants';
import { NoteLine } from '../../drawer-parts';
import { GoalCompletionNote } from './SelectedWalletNote.styles';

type SelectedWalletForm = Pick<
  WithdrawalFormState,
  'savingsLockedFor' | 'goalToComplete' | 'isOverdraft' | 'requestState' | 'selectedBalance'
>;

interface SelectedWalletNoteProps {
  form: SelectedWalletForm;
}

function noteFor(form: SelectedWalletForm): JSX.Element | null {
  if (form.savingsLockedFor) {
    return null;
  }

  const requestFailed = form.requestState === REQUEST_STATE.failed;

  if (form.goalToComplete && !form.isOverdraft && !requestFailed) {
    const completesGoalText = WITHDRAWAL_FORM_COPY.completesGoal(form.goalToComplete.name);

    return (
      <GoalCompletionNote data-testid={WITHDRAWAL_FORM_TEST_IDS.completesGoal}>
        {completesGoalText}
      </GoalCompletionNote>
    );
  }

  const balanceShekels = agorotToShekels(form.selectedBalance);

  return (
    <WithdrawalAlert
      isOverdraft={form.isOverdraft}
      hasError={requestFailed}
      balanceShekels={balanceShekels}
    />
  );
}

export function SelectedWalletNote({ form }: SelectedWalletNoteProps): JSX.Element {
  const note = noteFor(form);

  return <NoteLine>{note}</NoteLine>;
}

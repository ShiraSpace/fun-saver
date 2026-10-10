import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { MONEY_COPY } from '@/components/Money/constants';
import { WITHDRAWAL_FORM_COPY } from './constants';

interface WithdrawalCopyInput {
  isDonation: boolean;
  savingsLockedFor?: SavedTowardGoal;
  requestState: RequestState;
  amountShekels: number;
}

interface WithdrawalCopy {
  title: string;
  submitLabel: string;
}

function submitLabel({
  isDonation,
  savingsLockedFor,
  requestState,
  amountShekels,
}: WithdrawalCopyInput): string {
  if (savingsLockedFor) {
    return WITHDRAWAL_FORM_COPY.savingsLockedSubmit;
  }

  if (requestState === REQUEST_STATE.pending) {
    return WITHDRAWAL_FORM_COPY.submitting;
  }

  const submitVerb = isDonation
    ? WITHDRAWAL_FORM_COPY.donationSubmit
    : WITHDRAWAL_FORM_COPY.submit;

  return `${submitVerb} ${MONEY_COPY.currencySign}${amountShekels}`;
}

export function withdrawalCopy(input: WithdrawalCopyInput): WithdrawalCopy {
  return {
    title: input.isDonation
      ? WITHDRAWAL_FORM_COPY.donationTitle
      : WITHDRAWAL_FORM_COPY.title,
    submitLabel: submitLabel(input),
  };
}

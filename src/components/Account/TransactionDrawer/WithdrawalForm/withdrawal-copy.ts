import { MONEY_COPY } from '@/components/Money/constants';
import { WITHDRAWAL_FORM_COPY } from './constants';

interface WithdrawalCopyInput {
  isDonation: boolean;
  isSubmitting: boolean;
  amountShekels: number;
}

interface WithdrawalCopy {
  title: string;
  submitLabel: string;
}

export function withdrawalCopy({
  isDonation,
  isSubmitting,
  amountShekels,
}: WithdrawalCopyInput): WithdrawalCopy {
  const submitVerb = isDonation
    ? WITHDRAWAL_FORM_COPY.donationSubmit
    : WITHDRAWAL_FORM_COPY.submit;

  return {
    title: isDonation
      ? WITHDRAWAL_FORM_COPY.donationTitle
      : WITHDRAWAL_FORM_COPY.title,
    submitLabel: isSubmitting
      ? WITHDRAWAL_FORM_COPY.submitting
      : `${submitVerb} ${MONEY_COPY.currency}${amountShekels}`,
  };
}

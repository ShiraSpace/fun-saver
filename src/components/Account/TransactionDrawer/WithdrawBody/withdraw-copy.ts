import { MONEY_COPY } from '@/components/Money/constants';
import { WITHDRAW_BODY_COPY } from './constants';

interface WithdrawInProgress {
  isDonation: boolean;
  isSubmitting: boolean;
  amount: number;
}

interface WithdrawCopy {
  title: string;
  submitLabel: string;
}

export function withdrawCopy({
  isDonation,
  isSubmitting,
  amount,
}: WithdrawInProgress): WithdrawCopy {
  const confirmVerb = isDonation
    ? WITHDRAW_BODY_COPY.donationConfirm
    : WITHDRAW_BODY_COPY.confirm;

  return {
    title: isDonation
      ? WITHDRAW_BODY_COPY.donationTitle
      : WITHDRAW_BODY_COPY.title,
    submitLabel: isSubmitting
      ? WITHDRAW_BODY_COPY.submitting
      : `${confirmVerb} ${MONEY_COPY.currency}${amount}`,
  };
}

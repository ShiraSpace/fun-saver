import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { splitDeposit, type DepositSplit } from '@/lib/transactions';
import { useAddTransaction } from './use-add-transaction';
import { useAmountForm, type AmountForm } from './use-amount-form';

interface DepositForm extends AmountForm {
  split: DepositSplit;
  canSubmit: boolean;
}

export function useDepositForm(
  accountId: string,
  onClose: () => void
): DepositForm {
  const { addDeposit } = useAddTransaction(accountId);
  const form = useAmountForm(addDeposit, onClose);

  return {
    ...form,
    split: splitDeposit(form.amount * AGOROT_PER_SHEKEL),
    canSubmit: form.amount > 0 && !form.isSubmitting,
  };
}

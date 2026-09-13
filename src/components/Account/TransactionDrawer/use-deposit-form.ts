import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { splitDeposit, type DepositSplit } from '@/lib/transactions';
import { useAddTransaction } from './use-add-transaction';
import { useAmountEntry, type AmountEntry } from './use-amount-entry';

interface DepositForm extends AmountEntry {
  split: DepositSplit;
  canSubmit: boolean;
}

export function useDepositForm(
  accountId: string,
  onClose: () => void
): DepositForm {
  const { addDeposit } = useAddTransaction(accountId);
  const entry = useAmountEntry(addDeposit, onClose);

  return {
    ...entry,
    split: splitDeposit(entry.amount * AGOROT_PER_SHEKEL),
    canSubmit: entry.amount > 0 && !entry.isSubmitting,
  };
}

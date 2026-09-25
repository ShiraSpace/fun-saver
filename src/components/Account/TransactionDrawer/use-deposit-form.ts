import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import {
  splitDeposit,
  type DepositSplit,
} from '@/lib/transaction/transactions';
import { useAddTransaction } from './use-add-transaction';
import { useAmountEntry, type AmountEntry } from './use-amount-entry';

interface DepositFormState extends AmountEntry {
  split: DepositSplit;
  canSubmit: boolean;
}

export function useDepositForm(
  accountId: string,
  onClose: () => void
): DepositFormState {
  const { addDeposit } = useAddTransaction(accountId);
  const entry = useAmountEntry(addDeposit, onClose);

  return {
    ...entry,
    split: splitDeposit(entry.amountShekels * AGOROT_PER_SHEKEL),
    canSubmit: entry.amountShekels > 0 && !entry.isSubmitting,
  };
}

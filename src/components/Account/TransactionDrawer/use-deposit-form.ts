import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import {
  splitDeposit,
  type DepositSplit,
} from '@/lib/transaction/transactions';
import { REQUEST_STATE } from '@/lib/request-state';
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

  const canSubmit =
    entry.amountShekels > 0 && entry.requestState !== REQUEST_STATE.pending;

  return {
    ...entry,
    split: splitDeposit(entry.amountShekels * AGOROT_PER_SHEKEL),
    canSubmit,
  };
}

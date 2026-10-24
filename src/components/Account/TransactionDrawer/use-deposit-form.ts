import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { splitDeposit, type DepositSplit } from '@/lib/transaction/transactions';
import { REQUEST_STATE } from '@/lib/request-state';
import { deposit } from '@/lib/transaction/transaction-requests';
import { useAmountEntry, type AmountEntry } from './use-amount-entry';

interface DepositFormState extends AmountEntry {
  split: DepositSplit;
  canSubmit: boolean;
}

export function useDepositForm(accountId: string, onSaved: () => void): DepositFormState {
  const entry = useAmountEntry((amountShekels) => deposit(accountId, amountShekels), onSaved);

  const canSubmit = entry.amountShekels > 0 && entry.requestState !== REQUEST_STATE.pending;

  return {
    ...entry,
    split: splitDeposit(entry.amountShekels * AGOROT_PER_SHEKEL),
    canSubmit,
  };
}

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { REQUEST_STATE, type RequestState } from '@/lib/request-state';
import { pushDigit, popDigit } from './amount-keypad';

export interface AmountEntry {
  amountShekels: number;
  requestState: RequestState;
  onDigit: (digit: number) => void;
  onClear: () => void;
  onBackspace: () => void;
  onSubmit: () => void;
}

export function useAmountEntry(
  saveTransaction: (amountShekels: number) => Promise<void>,
  onClose: () => void
): AmountEntry {
  const router = useRouter();
  const [amountShekels, setAmountShekels] = useState(0);
  const [requestState, setRequestState] = useState<RequestState>(
    REQUEST_STATE.idle
  );

  const submit = async (): Promise<void> => {
    setRequestState(REQUEST_STATE.pending);

    try {
      await saveTransaction(amountShekels);
      router.refresh();
      onClose();
    } catch {
      setRequestState(REQUEST_STATE.failed);
    }
  };

  return {
    amountShekels,
    requestState,
    onDigit: (digit) =>
      setAmountShekels((current) => pushDigit(current, digit)),
    onClear: () => setAmountShekels(0),
    onBackspace: () => setAmountShekels((current) => popDigit(current)),
    onSubmit: () => void submit(),
  };
}

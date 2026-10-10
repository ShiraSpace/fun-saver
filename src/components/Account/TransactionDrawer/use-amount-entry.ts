import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusCodes } from 'http-status-codes';
import { RequestFailedError } from '@/lib/fetch-json';
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

function isConflict(error: unknown): boolean {
  return (
    error instanceof RequestFailedError && error.status === StatusCodes.CONFLICT
  );
}

export function useAmountEntry(
  saveTransaction: (amountShekels: number) => Promise<void>,
  onSaved: () => void
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
      onSaved();
    } catch (error) {
      if (isConflict(error)) {
        router.refresh();
      }

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

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pushDigit, popDigit } from './amount-keypad';

export interface AmountEntry {
  amount: number;
  isSubmitting: boolean;
  hasError: boolean;
  canSubmit: boolean;
  onDigit: (digit: number) => void;
  onClear: () => void;
  onBackspace: () => void;
  onConfirm: () => void;
}

export function useAmountEntry(
  commit: (amountShekels: number) => Promise<void>,
  onClose: () => void
): AmountEntry {
  const router = useRouter();
  const [amount, setAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const submit = async (): Promise<void> => {
    setIsSubmitting(true);
    setHasError(false);

    try {
      await commit(amount);
      router.refresh();
      onClose();
    } catch {
      setHasError(true);
      setIsSubmitting(false);
    }
  };

  return {
    amount,
    isSubmitting,
    hasError,
    canSubmit: amount > 0 && !isSubmitting,
    onDigit: (digit) => setAmount((current) => pushDigit(current, digit)),
    onClear: () => setAmount(0),
    onBackspace: () => setAmount((current) => popDigit(current)),
    onConfirm: () => void submit(),
  };
}

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pushDigit, popDigit } from './amount-keypad';

export interface AmountEntry {
  amountShekels: number;
  isSubmitting: boolean;
  hasError: boolean;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const submit = async (): Promise<void> => {
    setIsSubmitting(true);
    setHasError(false);

    try {
      await saveTransaction(amountShekels);
      router.refresh();
      onClose();
    } catch {
      setHasError(true);
      setIsSubmitting(false);
    }
  };

  return {
    amountShekels,
    isSubmitting,
    hasError,
    onDigit: (digit) =>
      setAmountShekels((current) => pushDigit(current, digit)),
    onClear: () => setAmountShekels(0),
    onBackspace: () => setAmountShekels((current) => popDigit(current)),
    onSubmit: () => void submit(),
  };
}

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import { splitDeposit, type DepositSplit } from '@/lib/transactions';
import { pushDigit, popDigit } from './amount-keypad';
import { useAddTransaction } from './use-add-transaction';

interface DepositForm {
  amount: number;
  split: DepositSplit;
  isSubmitting: boolean;
  hasError: boolean;
  canSubmit: boolean;
  onDigit: (digit: number) => void;
  onClear: () => void;
  onBackspace: () => void;
  onConfirm: () => void;
}

export function useDepositForm(
  accountId: string,
  onClose: () => void
): DepositForm {
  const router = useRouter();
  const { addDeposit } = useAddTransaction(accountId);
  const [amount, setAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const submit = async (): Promise<void> => {
    setIsSubmitting(true);
    setHasError(false);

    try {
      await addDeposit(amount);
      router.refresh();
      onClose();
    } catch {
      setHasError(true);
      setIsSubmitting(false);
    }
  };

  return {
    amount,
    split: splitDeposit(amount * AGOROT_PER_SHEKEL),
    isSubmitting,
    hasError,
    canSubmit: amount > 0 && !isSubmitting,
    onDigit: (digit) => setAmount((current) => pushDigit(current, digit)),
    onClear: () => setAmount(0),
    onBackspace: () => setAmount((current) => popDigit(current)),
    onConfirm: () => void submit(),
  };
}

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import type { WalletWithDerived } from '@/lib/types';
import { pushDigit, popDigit } from './amount-keypad';
import { useAddTransaction } from './use-add-transaction';

interface WithdrawForm {
  selectedId: string;
  selectedBalance: number;
  amount: number;
  isDonation: boolean;
  isOverdraft: boolean;
  isSubmitting: boolean;
  hasError: boolean;
  canSubmit: boolean;
  onSelectWallet: (id: string) => void;
  onDigit: (digit: number) => void;
  onClear: () => void;
  onBackspace: () => void;
  onConfirm: () => void;
}

export function useWithdrawForm(
  accountId: string,
  wallets: WalletWithDerived[],
  onClose: () => void
): WithdrawForm {
  const router = useRouter();
  const { withdraw } = useAddTransaction(accountId);
  const [selectedId, setSelectedId] = useState(wallets[0]?.id ?? '');
  const [amount, setAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const selectedWallet = wallets.find((wallet) => wallet.id === selectedId);
  const isOverdraft =
    !!selectedWallet && amount * AGOROT_PER_SHEKEL > selectedWallet.balance;
  const isDonation = selectedWallet?.name === 'goodDeeds';

  const submit = async (): Promise<void> => {
    setIsSubmitting(true);
    setHasError(false);

    try {
      await withdraw(selectedId, amount);
      router.refresh();
      onClose();
    } catch {
      setHasError(true);
      setIsSubmitting(false);
    }
  };

  return {
    selectedId,
    selectedBalance: selectedWallet?.balance ?? 0,
    amount,
    isDonation,
    isOverdraft,
    isSubmitting,
    hasError,
    canSubmit: amount > 0 && !isOverdraft && !isSubmitting,
    onSelectWallet: setSelectedId,
    onDigit: (digit) => setAmount((current) => pushDigit(current, digit)),
    onClear: () => setAmount(0),
    onBackspace: () => setAmount((current) => popDigit(current)),
    onConfirm: () => void submit(),
  };
}

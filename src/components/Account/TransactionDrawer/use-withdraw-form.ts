import { useState } from 'react';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import type { WalletWithDerived } from '@/lib/types';
import { useAddTransaction } from './use-add-transaction';
import { useAmountForm, type AmountForm } from './use-amount-form';

interface WithdrawForm extends AmountForm {
  selectedId: string;
  selectedBalance: number;
  isDonation: boolean;
  isOverdraft: boolean;
  canSubmit: boolean;
  onSelectWallet: (id: string) => void;
}

export function useWithdrawForm(
  accountId: string,
  wallets: WalletWithDerived[],
  onClose: () => void
): WithdrawForm {
  const { withdraw } = useAddTransaction(accountId);
  const [selectedId, setSelectedId] = useState(wallets[0]?.id ?? '');
  const form = useAmountForm((amount) => withdraw(selectedId, amount), onClose);

  const selectedWallet = wallets.find((wallet) => wallet.id === selectedId);
  const isOverdraft =
    !!selectedWallet &&
    form.amount * AGOROT_PER_SHEKEL > selectedWallet.balance;

  return {
    ...form,
    selectedId,
    selectedBalance: selectedWallet?.balance ?? 0,
    isDonation: selectedWallet?.name === 'goodDeeds',
    isOverdraft,
    canSubmit: form.amount > 0 && !isOverdraft && !form.isSubmitting,
    onSelectWallet: setSelectedId,
  };
}

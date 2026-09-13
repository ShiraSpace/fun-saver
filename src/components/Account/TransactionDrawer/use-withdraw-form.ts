import { useState } from 'react';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import type { WalletWithDerived } from '@/lib/types';
import { useAddTransaction } from './use-add-transaction';
import { useAmountEntry, type AmountEntry } from './use-amount-entry';

interface WithdrawForm extends AmountEntry {
  selectedId: string;
  selectedBalance: number;
  isDonation: boolean;
  isOverdraft: boolean;
  onSelectWallet: (id: string) => void;
}

export function useWithdrawForm(
  accountId: string,
  wallets: WalletWithDerived[],
  onClose: () => void
): WithdrawForm {
  const { withdraw } = useAddTransaction(accountId);
  const [selectedId, setSelectedId] = useState(wallets[0]?.id ?? '');
  const entry = useAmountEntry(
    (amount) => withdraw(selectedId, amount),
    onClose
  );

  const selectedWallet = wallets.find((wallet) => wallet.id === selectedId);
  const isOverdraft =
    !!selectedWallet &&
    entry.amount * AGOROT_PER_SHEKEL > selectedWallet.balance;

  return {
    ...entry,
    selectedId,
    selectedBalance: selectedWallet?.balance ?? 0,
    isDonation: selectedWallet?.name === 'goodDeeds',
    isOverdraft,
    canSubmit: entry.canSubmit && !isOverdraft,
    onSelectWallet: setSelectedId,
  };
}

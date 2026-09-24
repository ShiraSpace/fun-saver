import { useState } from 'react';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import type { WalletWithDerived } from '@/lib/types';
import { useAddTransaction } from './use-add-transaction';
import { useAmountEntry, type AmountEntry } from './use-amount-entry';

interface WithdrawalFormState extends AmountEntry {
  selectedId: string;
  selectedBalance: number;
  isDonation: boolean;
  isOverdraft: boolean;
  canSubmit: boolean;
  onSelectWallet: (id: string) => void;
}

export function useWithdrawalForm(
  accountId: string,
  wallets: WalletWithDerived[],
  onClose: () => void
): WithdrawalFormState {
  const { addWithdrawal } = useAddTransaction(accountId);
  const [selectedId, setSelectedId] = useState(wallets[0]?.id ?? '');
  const entry = useAmountEntry(
    (amountShekels) => addWithdrawal(selectedId, amountShekels),
    onClose
  );

  const selectedWallet = wallets.find((wallet) => wallet.id === selectedId);
  const isOverdraft =
    !!selectedWallet &&
    entry.amountShekels * AGOROT_PER_SHEKEL > selectedWallet.balance;

  return {
    ...entry,
    selectedId,
    selectedBalance: selectedWallet?.balance ?? 0,
    isDonation: selectedWallet?.name === 'goodDeeds',
    isOverdraft,
    canSubmit: entry.amountShekels > 0 && !isOverdraft && !entry.isSubmitting,
    onSelectWallet: setSelectedId,
  };
}

import { useState } from 'react';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import type { WalletWithDerived } from '@/lib/types';
import { useAddTransaction } from './use-add-transaction';
import { useAmountEntry, type AmountEntry } from './use-amount-entry';

interface WithdrawalFormState extends AmountEntry {
  selectedWalletId: string;
  selectedBalance: number;
  isDonation: boolean;
  isOverdraft: boolean;
  canSubmit: boolean;
  onSelectWallet: (walletId: string) => void;
}

export function useWithdrawalForm(
  accountId: string,
  wallets: WalletWithDerived[],
  onClose: () => void
): WithdrawalFormState {
  const { addWithdrawal } = useAddTransaction(accountId);
  const [selectedWalletId, setSelectedWalletId] = useState(
    wallets[0]?.id ?? ''
  );
  const entry = useAmountEntry(
    (amountShekels) => addWithdrawal(selectedWalletId, amountShekels),
    onClose
  );

  const selectedWallet = wallets.find(
    (wallet) => wallet.id === selectedWalletId
  );
  const isOverdraft =
    !!selectedWallet &&
    entry.amountShekels * AGOROT_PER_SHEKEL > selectedWallet.balance;

  return {
    ...entry,
    selectedWalletId,
    selectedBalance: selectedWallet?.balance ?? 0,
    isDonation: selectedWallet?.name === 'goodDeeds',
    isOverdraft,
    canSubmit: entry.amountShekels > 0 && !isOverdraft && !entry.isSubmitting,
    onSelectWallet: setSelectedWalletId,
  };
}

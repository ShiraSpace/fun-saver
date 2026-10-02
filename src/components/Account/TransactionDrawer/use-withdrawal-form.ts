import { useState } from 'react';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import type { WalletSummary } from '@/lib/wallet/types';
import { useAddTransaction } from './use-add-transaction';
import { useAmountEntry, type AmountEntry } from './use-amount-entry';
import { DEFAULT_WITHDRAWAL_WALLET_NAMES } from './constants';

interface WithdrawalFormState extends AmountEntry {
  selectedWalletId: string;
  selectedBalance: number;
  isDonation: boolean;
  isOverdraft: boolean;
  canSubmit: boolean;
  onSelectWallet: (walletId: string) => void;
}

function defaultWithdrawalWallet(
  wallets: WalletSummary[]
): WalletSummary | undefined {
  const defaultWallets = DEFAULT_WITHDRAWAL_WALLET_NAMES.flatMap((walletName) =>
    wallets.filter((wallet) => wallet.name === walletName)
  );

  return (
    defaultWallets.find((wallet) => wallet.balance > 0) ?? defaultWallets[0]
  );
}

export function useWithdrawalForm(
  accountId: string,
  wallets: WalletSummary[],
  onClose: () => void
): WithdrawalFormState {
  const { addWithdrawal } = useAddTransaction(accountId);
  const [selectedWalletId, setSelectedWalletId] = useState(
    defaultWithdrawalWallet(wallets)?.id ?? ''
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

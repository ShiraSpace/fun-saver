import { useState } from 'react';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import type { WalletSummary } from '@/lib/wallet/types';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { defaultWithdrawalWallet } from '@/lib/wallet/default-withdrawal-wallet';
import { REQUEST_STATE } from '@/lib/request-state';
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
  wallets: WalletSummary[],
  onSaved: () => void
): WithdrawalFormState {
  const { addWithdrawal } = useAddTransaction(accountId);
  const [selectedWalletId, setSelectedWalletId] = useState(
    () => defaultWithdrawalWallet(wallets)?.id ?? ''
  );
  const entry = useAmountEntry(
    (amountShekels) => addWithdrawal(selectedWalletId, amountShekels),
    onSaved
  );

  const selectedWallet = wallets.find(
    (wallet) => wallet.id === selectedWalletId
  );
  const isOverdraft =
    !!selectedWallet &&
    entry.amountShekels * AGOROT_PER_SHEKEL > selectedWallet.balance;

  const canSubmit =
    entry.amountShekels > 0 &&
    !isOverdraft &&
    entry.requestState !== REQUEST_STATE.pending;

  return {
    ...entry,
    selectedWalletId,
    selectedBalance: selectedWallet?.balance ?? 0,
    isDonation: selectedWallet?.name === WALLET_NAMES.goodDeeds,
    isOverdraft,
    canSubmit,
    onSelectWallet: setSelectedWalletId,
  };
}

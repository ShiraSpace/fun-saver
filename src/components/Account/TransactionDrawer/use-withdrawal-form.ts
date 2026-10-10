import { useState } from 'react';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import type { AccountSummary } from '@/lib/account/types';
import type { WalletSummary } from '@/lib/wallet/types';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { defaultWithdrawalWallet } from '@/lib/wallet/default-withdrawal-wallet';
import {
  savedTowardGoal,
  type SavedTowardGoal,
} from '@/lib/goal/saved-toward-goal';
import { REQUEST_STATE } from '@/lib/request-state';
import { useAddTransaction } from './use-add-transaction';
import { useAmountEntry, type AmountEntry } from './use-amount-entry';

interface GoalOnSelectedWallet {
  isSavingsLocked: boolean;
  completesGoal: boolean;
}

interface WithdrawalFormState extends AmountEntry, GoalOnSelectedWallet {
  selectedWalletId: string;
  selectedBalance: number;
  isDonation: boolean;
  isOverdraft: boolean;
  canSubmit: boolean;
  savedTowardGoal?: SavedTowardGoal;
  onSelectWallet: (walletId: string) => void;
}

function goalOnSelectedWallet(
  accountGoal: SavedTowardGoal | undefined,
  selectedWallet: WalletSummary | undefined
): GoalOnSelectedWallet {
  const isSavingsGoal =
    !!accountGoal && selectedWallet?.name === WALLET_NAMES.savings;

  return {
    isSavingsLocked: isSavingsGoal && !accountGoal.reached,
    completesGoal: isSavingsGoal && accountGoal.reached,
  };
}

export function useWithdrawalForm(
  account: AccountSummary,
  onClose: () => void
): WithdrawalFormState {
  const { wallets } = account;
  const { addWithdrawal } = useAddTransaction(account.id);
  const [selectedWalletId, setSelectedWalletId] = useState(
    () => defaultWithdrawalWallet(wallets)?.id ?? ''
  );
  const entry = useAmountEntry(
    (amountShekels) => addWithdrawal(selectedWalletId, amountShekels),
    onClose
  );

  const selectedWallet = wallets.find(
    (wallet) => wallet.id === selectedWalletId
  );
  const accountGoal = savedTowardGoal(account);
  const goal = goalOnSelectedWallet(accountGoal, selectedWallet);
  const isOverdraft =
    !!selectedWallet &&
    entry.amountShekels * AGOROT_PER_SHEKEL > selectedWallet.balance;

  const canSubmit =
    entry.amountShekels > 0 &&
    !isOverdraft &&
    !goal.isSavingsLocked &&
    entry.requestState !== REQUEST_STATE.pending;

  return {
    ...entry,
    ...goal,
    selectedWalletId,
    selectedBalance: selectedWallet?.balance ?? 0,
    isDonation: selectedWallet?.name === WALLET_NAMES.goodDeeds,
    isOverdraft,
    canSubmit,
    savedTowardGoal: accountGoal,
    onSelectWallet: setSelectedWalletId,
  };
}

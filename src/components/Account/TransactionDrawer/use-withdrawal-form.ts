import { useState } from 'react';
import { AGOROT_PER_SHEKEL } from '@/lib/constants';
import type { AccountSummary } from '@/lib/account/types';
import type { WalletSummary } from '@/lib/wallet/types';
import { WALLET_NAMES } from '@/lib/wallet/constants';
import { defaultWithdrawalWallet } from '@/lib/wallet/default-withdrawal-wallet';
import type { Goal } from '@/lib/goal/types';
import {
  savedTowardGoalOf,
  savingsLocked,
  type SavedTowardGoal,
} from '@/lib/goal/saved-toward-goal';
import { REQUEST_STATE } from '@/lib/request-state';
import { useAddTransaction } from './use-add-transaction';
import { useAmountEntry, type AmountEntry } from './use-amount-entry';

interface GoalOnPickedWallet {
  savingsLockedFor?: SavedTowardGoal;
  goalToComplete?: Goal;
}

export interface WithdrawalFormState extends AmountEntry, GoalOnPickedWallet {
  selectedWalletId: string;
  selectedBalance: number;
  isDonation: boolean;
  isOverdraft: boolean;
  canSubmit: boolean;
  savedTowardGoal?: SavedTowardGoal;
  onSelectWallet: (walletId: string) => void;
}

function goalOnPickedWallet(
  pickedWallet: WalletSummary | undefined,
  savedTowardGoal: SavedTowardGoal | undefined
): GoalOnPickedWallet {
  if (pickedWallet?.name !== WALLET_NAMES.savings || !savedTowardGoal) {
    return {};
  }

  return savingsLocked(savedTowardGoal)
    ? { savingsLockedFor: savedTowardGoal }
    : { goalToComplete: savedTowardGoal.goal };
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
  const savedTowardGoal = savedTowardGoalOf(account);
  const goalOnWallet = goalOnPickedWallet(selectedWallet, savedTowardGoal);
  const isOverdraft =
    !!selectedWallet &&
    entry.amountShekels * AGOROT_PER_SHEKEL > selectedWallet.balance;

  const canSubmit =
    entry.amountShekels > 0 &&
    !isOverdraft &&
    !goalOnWallet.savingsLockedFor &&
    entry.requestState !== REQUEST_STATE.pending;

  return {
    ...entry,
    ...goalOnWallet,
    selectedWalletId,
    selectedBalance: selectedWallet?.balance ?? 0,
    isDonation: selectedWallet?.name === WALLET_NAMES.goodDeeds,
    isOverdraft,
    canSubmit,
    savedTowardGoal,
    onSelectWallet: setSelectedWalletId,
  };
}

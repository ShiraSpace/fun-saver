import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';
import { TRANSACTION_TYPE } from '@/lib/transaction/constants';
import { DepositForm } from '../DepositForm';
import { WithdrawalForm } from '../WithdrawalForm';
import type { EnteredTransactionType } from '../constants';

interface TransactionFormProps {
  transactionType: EnteredTransactionType;
  account: AccountSummary;
  savedTowardGoal?: SavedTowardGoal;
  onClose: () => void;
}

export function TransactionForm({
  transactionType,
  account,
  savedTowardGoal,
  onClose,
}: TransactionFormProps): JSX.Element {
  if (transactionType === TRANSACTION_TYPE.deposit) {
    return <DepositForm account={account} onClose={onClose} />;
  }

  return (
    <WithdrawalForm
      account={account}
      savedTowardGoal={savedTowardGoal}
      onClose={onClose}
    />
  );
}

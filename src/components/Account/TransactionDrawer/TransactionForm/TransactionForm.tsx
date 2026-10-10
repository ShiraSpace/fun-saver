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
  onSaved: () => void;
}

export function TransactionForm({
  transactionType,
  account,
  savedTowardGoal,
  onSaved,
}: TransactionFormProps): JSX.Element {
  if (transactionType === TRANSACTION_TYPE.deposit) {
    return <DepositForm account={account} onSaved={onSaved} />;
  }

  return (
    <WithdrawalForm
      account={account}
      savedTowardGoal={savedTowardGoal}
      onSaved={onSaved}
    />
  );
}

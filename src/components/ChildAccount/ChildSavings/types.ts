import type { WalletSummary } from '@/lib/wallet/types';
import type { SavedTowardGoal } from '@/lib/goal/saved-toward-goal';

export interface ChildSavingsProps {
  accountId: string;
  savings: WalletSummary;
  savedTowardGoal?: SavedTowardGoal;
}

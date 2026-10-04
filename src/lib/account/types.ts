import type { ThemeId } from '@/theme/registry';
import type { ViewMode } from './view-mode';
import type { Wallet, WalletSummary } from '@/lib/wallet/types';
import type { Goal } from '@/lib/goal/types';

export interface Account {
  id: string;
  name: string;
  avatarId: string;
  isActive: boolean;
  themeId: ThemeId;
  viewMode: ViewMode;
  wallets: Wallet[];
}

export interface AccountEdits {
  name?: string;
  avatarId?: string;
}

export interface AccountSummary extends Account {
  wallets: WalletSummary[];
  goal?: Goal;
}

export type AccountUserRole = 'owner' | 'editor' | 'viewer';

export interface AccountUser {
  accountId: string;
  userId: string;
  role: AccountUserRole;
  addedAt: string;
}

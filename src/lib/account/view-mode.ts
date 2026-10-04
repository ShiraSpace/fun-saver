import { otherAccounts } from './current-account';
import type { Account } from './types';

export const VIEW_MODE = {
  parent: 'parent',
  child: 'child',
} as const;

export type ViewMode = (typeof VIEW_MODE)[keyof typeof VIEW_MODE];

const VIEW_MODES: readonly string[] = Object.values(VIEW_MODE);

export function isViewMode(value: unknown): value is ViewMode {
  return typeof value === 'string' && VIEW_MODES.includes(value);
}

export function resolveViewMode(stored: string | undefined): ViewMode {
  return isViewMode(stored) ? stored : VIEW_MODE.parent;
}

export function isShownToChild(account: Pick<Account, 'viewMode'>): boolean {
  return account.viewMode === VIEW_MODE.child;
}

export function siblingAccountsShownToChild<
  ShownAccount extends Pick<Account, 'id' | 'viewMode'>,
>(accounts: ShownAccount[], currentAccount: ShownAccount): ShownAccount[] {
  return otherAccounts(accounts, currentAccount).filter(isShownToChild);
}

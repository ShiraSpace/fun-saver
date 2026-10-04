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

export function otherAccountsShownToChild<
  Shown extends Pick<Account, 'id' | 'viewMode'>,
>(accounts: Shown[], currentAccount: Shown): Shown[] {
  return accounts.filter(
    (account) => isShownToChild(account) && account.id !== currentAccount.id
  );
}

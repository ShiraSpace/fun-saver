import type { Account } from './types';

export const APP_VIEW_MODE = {
  parent: 'parent',
  child: 'child',
} as const;

export type AppViewMode = (typeof APP_VIEW_MODE)[keyof typeof APP_VIEW_MODE];

const APP_VIEW_MODES: readonly string[] = Object.values(APP_VIEW_MODE);

export function isAppViewMode(value: unknown): value is AppViewMode {
  return typeof value === 'string' && APP_VIEW_MODES.includes(value);
}

export function resolveAppViewMode(stored: string | undefined): AppViewMode {
  return isAppViewMode(stored) ? stored : APP_VIEW_MODE.parent;
}

export function isChildView(account: Pick<Account, 'viewMode'>): boolean {
  return account.viewMode === APP_VIEW_MODE.child;
}

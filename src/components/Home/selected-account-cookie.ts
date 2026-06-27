export const SELECTED_ACCOUNT_COOKIE = 'selectedAccountId';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function persistSelectedAccount(accountId: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${SELECTED_ACCOUNT_COOKIE}=${accountId}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
}

export const SELECTED_ACCOUNT_COOKIE = 'selectedAccountId';
export const THEME_COOKIE = 'themeId';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function writeCookie(name: string, value: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=${value}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
}

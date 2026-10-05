export const CURRENT_ACCOUNT_COOKIE = 'selectedAccountId';
export const THEME_COOKIE = 'themeId';
export const VIEW_MODE_COOKIE = 'viewMode';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

export function writeCookie(name: string, value: string): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=${value}; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
}

export function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }

  const prefix = `${name}=`;
  const cookie = document.cookie
    .split('; ')
    .find((nameAndValue) => nameAndValue.startsWith(prefix));

  return cookie?.slice(prefix.length);
}

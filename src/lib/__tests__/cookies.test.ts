import { captureCookies } from '@/test-utils/cookies';
import { CURRENT_ACCOUNT_COOKIE, THEME_COOKIE, writeCookie } from '../cookies';

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

const policyOf = (cookie: string): string =>
  cookie.split('; ').slice(1).join('; ');

describe('writeCookie', () => {
  const written = captureCookies();

  it('keeps the value for a year, on every path, same-site lax', () => {
    writeCookie(THEME_COOKIE, 'midnight-blue');

    expect(written).toEqual([
      `themeId=midnight-blue; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`,
    ]);
  });

  it('writes every cookie the app owns under that one policy', () => {
    writeCookie(CURRENT_ACCOUNT_COOKIE, 'account-1');
    writeCookie(THEME_COOKIE, 'jungle-quest');

    expect(new Set(written.map(policyOf)).size).toBe(1);
  });

  it('leaves the cookie readable once written', () => {
    writeCookie(THEME_COOKIE, 'jungle-quest');

    expect(document.cookie).toBe('themeId=jungle-quest');
  });
});

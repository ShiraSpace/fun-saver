import { captureCookies } from '@/test-utils/cookies';
import {
  CURRENT_ACCOUNT_COOKIE,
  readCookie,
  THEME_COOKIE,
  VIEW_MODE_COOKIE,
  writeCookie,
} from '../cookies';

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

  it('remembers the current account under the name returning browsers already hold it by', () => {
    writeCookie(CURRENT_ACCOUNT_COOKIE, 'account-1');

    expect(document.cookie).toBe('selectedAccountId=account-1');
  });
});

describe('readCookie', () => {
  captureCookies();

  beforeEach(() => {
    writeCookie(THEME_COOKIE, 'jungle-quest');
    writeCookie(VIEW_MODE_COOKIE, 'child');
    writeCookie(CURRENT_ACCOUNT_COOKIE, 'account-1');
  });

  it('finds a cookie among several', () => {
    expect(readCookie(VIEW_MODE_COOKIE)).toBe('child');
  });

  it.each([
    ['that was never written', 'neverWritten'],
    ['whose name only starts one that was', 'theme'],
  ])('answers undefined for a cookie %s', (_, name) => {
    expect(readCookie(name)).toBeUndefined();
  });
});

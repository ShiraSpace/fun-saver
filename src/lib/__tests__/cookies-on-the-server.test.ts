/**
 * @jest-environment node
 */
import { THEME_COOKIE, writeCookie } from '../cookies';

describe('writeCookie where the app renders on the server', () => {
  it('has no document to write to', () => {
    expect(globalThis.document).toBeUndefined();
  });

  it('stays quiet rather than throwing', () => {
    expect(() => writeCookie(THEME_COOKIE, 'midnight-blue')).not.toThrow();
  });
});

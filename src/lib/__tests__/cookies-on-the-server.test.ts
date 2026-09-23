/**
 * @jest-environment node
 */
import { THEME_COOKIE, writeCookie } from '../cookies';

describe('writeCookie where the app renders on the server', () => {
  it('really has no document here, or the test below proves nothing', () => {
    expect(globalThis.document).toBeUndefined();
  });

  it('stays quiet rather than throwing', () => {
    expect(() => writeCookie(THEME_COOKIE, 'midnight-blue')).not.toThrow();
  });
});

import type { Session } from 'next-auth';
import { mockUser } from '@/test-utils/fixtures';
import { sessionUser } from '../session-user';

const SESSION_EXPIRY = '2099-01-01T00:00:00.000Z';
const PHOTO_URL = 'https://example.com/photo.png';

function sessionFor(user: Session['user']): Session {
  return { user, expires: SESSION_EXPIRY };
}

describe('sessionUser', () => {
  it('reads nobody from no session', () => {
    expect(sessionUser(null)).toBeUndefined();
  });

  it('reads nobody from a session that names no id', () => {
    expect(
      sessionUser(sessionFor({ email: mockUser.email, name: mockUser.name }))
    ).toBeUndefined();
  });

  it('reads nobody from a session that names no email', () => {
    expect(
      sessionUser(sessionFor({ id: mockUser.id, name: mockUser.name }))
    ).toBeUndefined();
  });

  it('reads the user a full session names, photo included', () => {
    expect(
      sessionUser(
        sessionFor({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          image: PHOTO_URL,
        })
      )
    ).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      image: PHOTO_URL,
    });
  });

  it('leaves the photo out when the session carries none', () => {
    expect(
      sessionUser(
        sessionFor({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          image: null,
        })
      )?.image
    ).toBeUndefined();
  });
});

import type { Session } from 'next-auth';
import { mockUser } from '@/test-utils/fixtures';
import { toSignedInUser } from '../signed-in-user';

const SESSION_EXPIRY = '2099-01-01T00:00:00.000Z';
const PHOTO_URL = 'https://example.com/photo.png';

function sessionOf(user: Session['user']): Session {
  return { user, expires: SESSION_EXPIRY };
}

describe('toSignedInUser', () => {
  it('reads nobody from no session', () => {
    expect(toSignedInUser(null)).toBeUndefined();
  });

  it('reads nobody from a session that names no id', () => {
    expect(
      toSignedInUser(sessionOf({ email: mockUser.email, name: mockUser.name }))
    ).toBeUndefined();
  });

  it('reads nobody from a session that names no email', () => {
    expect(
      toSignedInUser(sessionOf({ id: mockUser.id, name: mockUser.name }))
    ).toBeUndefined();
  });

  it('reads the user a full session names, photo included', () => {
    expect(
      toSignedInUser(
        sessionOf({
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
      toSignedInUser(
        sessionOf({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          image: null,
        })
      )?.image
    ).toBeUndefined();
  });
});

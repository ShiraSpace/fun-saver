import { JSX } from 'react';
import { render, screen } from '@/test-utils/render';
import { mockUser } from '@/test-utils/fixtures';
import { captureCookies } from '@/test-utils/cookies';
import { THEME_COOKIE } from '@/lib/cookies';
import { THEME_ID } from '@/theme/registry';
import { useSignedInUser } from './signed-in-user-context';

const NAME_TESTID = 'signed-in-name';

function SignedInName(): JSX.Element {
  const user = useSignedInUser();
  return <span data-testid={NAME_TESTID}>{user.name}</span>;
}

describe('useSignedInUser', () => {
  it('hands the signed-in user to whoever asks', () => {
    render(<SignedInName />, { user: mockUser });

    expect(screen.getByTestId(NAME_TESTID)).toHaveTextContent(mockUser.name);
  });

  it('refuses to guess when no provider is above it', () => {
    expect(() => render(<SignedInName />)).toThrow(
      'useSignedInUser needs a SignedInUserProvider above it'
    );
  });
});

describe('remembering the theme for the next cold load', () => {
  const written = captureCookies();

  it('stores the theme of the screen a signed-in user is on', () => {
    render(<SignedInName />, {
      user: mockUser,
      themeId: THEME_ID.midnightBlue,
    });

    expect(written).toContainEqual(
      expect.stringContaining(`${THEME_COOKIE}=${THEME_ID.midnightBlue}`)
    );
  });

  it('stores nothing on a screen with no signed-in user', () => {
    render(<span />, { themeId: THEME_ID.midnightBlue });

    expect(written).toEqual([]);
  });
});

import { JSX } from 'react';
import { render, screen } from '@/test-utils/render';
import { mockUser } from '@/test-utils/fixtures';
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

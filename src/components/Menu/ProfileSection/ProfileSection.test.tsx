import { signOut } from 'next-auth/react';
import { fireEvent, render, screen } from '@/test-utils/render';
import { mockUser } from '@/test-utils/fixtures';
import { LOGIN_PATH } from '@/lib/constants';
import { ProfileSection } from './ProfileSection';
import { PROFILE_SECTION_TEST_IDS } from './constants';

const mockedSignOut = signOut as unknown as jest.Mock<Promise<void>>;

describe('ProfileSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSignOut.mockResolvedValue(undefined);
    render(<ProfileSection />);
  });

  it('names the signed-in user', () => {
    expect(screen.getByTestId(PROFILE_SECTION_TEST_IDS.name)).toHaveTextContent(
      mockUser.name
    );
  });

  it('shows the address that says which account is signed in', () => {
    expect(
      screen.getByTestId(PROFILE_SECTION_TEST_IDS.email)
    ).toHaveTextContent(mockUser.email);
  });

  it('signs out to the login page', () => {
    fireEvent.click(screen.getByTestId(PROFILE_SECTION_TEST_IDS.signOut));

    expect(mockedSignOut).toHaveBeenCalledWith({ redirectTo: LOGIN_PATH });
  });
});

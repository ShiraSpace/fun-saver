import { signOut } from 'next-auth/react';
import {
  fireEvent,
  renderWithUser,
  screen,
  waitFor,
} from '@/test-utils/render';
import { mockUser } from '@/test-utils/fixtures';
import { LOGIN_PATH } from '@/lib/constants';
import { ProfileSection } from './ProfileSection';
import { PROFILE_SECTION_CONTENT, PROFILE_SECTION_TEST_IDS } from './constants';

const mockedSignOut = signOut as unknown as jest.Mock<Promise<void>>;

const signOutButton = (): HTMLElement =>
  screen.getByTestId(PROFILE_SECTION_TEST_IDS.signOut);

const signOutError = (): HTMLElement | null =>
  screen.queryByTestId(PROFILE_SECTION_TEST_IDS.signOutError);

describe('ProfileSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSignOut.mockResolvedValue(undefined);
    renderWithUser(<ProfileSection />);
  });

  describe('before anything is tapped', () => {
    it('names the signed-in user', () => {
      expect(
        screen.getByTestId(PROFILE_SECTION_TEST_IDS.name)
      ).toHaveTextContent(mockUser.name);
    });

    it('shows the address that says which account is signed in', () => {
      expect(
        screen.getByTestId(PROFILE_SECTION_TEST_IDS.email)
      ).toHaveTextContent(mockUser.email);
    });

    it('offers a way out, and says nothing about failing', () => {
      expect(signOutButton()).toBeEnabled();
      expect(signOutError()).not.toBeInTheDocument();
    });
  });

  describe('when the way out is tapped', () => {
    beforeEach(() => {
      fireEvent.click(signOutButton());
    });

    it('signs out to the login page', () => {
      expect(mockedSignOut).toHaveBeenCalledWith({ redirectTo: LOGIN_PATH });
    });

    it('goes dead while the sign-out is on its way', async () => {
      await waitFor(() => {
        expect(signOutButton()).toBeDisabled();
      });
    });

    it('does not send a second request when tapped again', async () => {
      await waitFor(() => {
        expect(signOutButton()).toBeDisabled();
      });

      fireEvent.click(signOutButton());

      expect(mockedSignOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the sign-out does not go through', () => {
    beforeEach(async () => {
      mockedSignOut.mockRejectedValue(new Error('offline'));

      fireEvent.click(signOutButton());
      await screen.findByTestId(PROFILE_SECTION_TEST_IDS.signOutError);
    });

    it('says so', () => {
      expect(signOutError()).toHaveTextContent(
        PROFILE_SECTION_CONTENT.signOutFailed
      );
    });

    it('comes back so it can be tried again', () => {
      expect(signOutButton()).toBeEnabled();
    });
  });
});

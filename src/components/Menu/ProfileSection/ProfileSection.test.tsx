import { signOut } from 'next-auth/react';
import { fireEvent, screen, waitFor } from '@/test-utils/render';
import { mockUser } from '@/test-utils/fixtures';
import { closeAndReopenMenu, renderInOpenMenu } from '@/test-utils/menu';
import { LOGIN_PATH } from '@/lib/constants';
import { goTo } from '@/lib/navigate';
import { ProfileSection } from './ProfileSection';
import { PROFILE_SECTION_CONTENT, PROFILE_SECTION_TEST_IDS } from './constants';

jest.mock('@/lib/navigate', () => ({ goTo: jest.fn() }));

const mockedSignOut = signOut as unknown as jest.Mock<
  Promise<{ url: string } | undefined>
>;

const signOutButton = (): HTMLElement =>
  screen.getByTestId(PROFILE_SECTION_TEST_IDS.signOut);

const signOutError = (): HTMLElement | null =>
  screen.queryByTestId(PROFILE_SECTION_TEST_IDS.signOutError);

describe('ProfileSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSignOut.mockResolvedValue({ url: `http://localhost${LOGIN_PATH}` });
    renderInOpenMenu(<ProfileSection />, { user: mockUser });
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

    it('asks for the sign-out without letting it navigate on its own', () => {
      expect(mockedSignOut).toHaveBeenCalledWith({
        redirect: false,
        redirectTo: LOGIN_PATH,
      });
    });

    it('leaves for the login page only once the sign-out came back', async () => {
      await waitFor(() => {
        expect(goTo).toHaveBeenCalledWith(LOGIN_PATH);
      });
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

  describe('when the sign-out comes back pointing at the auth error page', () => {
    beforeEach(async () => {
      mockedSignOut.mockResolvedValue({
        url: 'http://localhost/api/auth/error?error=MissingCSRF',
      });

      fireEvent.click(signOutButton());
      await screen.findByTestId(PROFILE_SECTION_TEST_IDS.signOutError);
    });

    it('does not follow it, since the session is still alive', () => {
      expect(goTo).not.toHaveBeenCalled();
    });

    it('says the sign-out did not happen', () => {
      expect(signOutError()).toHaveTextContent(
        PROFILE_SECTION_CONTENT.signOutFailed
      );
    });
  });

  describe('when the server refuses the sign-out', () => {
    beforeEach(async () => {
      mockedSignOut.mockResolvedValue(undefined);

      fireEvent.click(signOutButton());
      await screen.findByTestId(PROFILE_SECTION_TEST_IDS.signOutError);
    });

    it('stays where it is rather than pretending it worked', () => {
      expect(goTo).not.toHaveBeenCalled();
    });

    it('says so, so the session is not believed to be over', () => {
      expect(signOutError()).toHaveTextContent(
        PROFILE_SECTION_CONTENT.signOutFailed
      );
    });

    describe('and the menu is closed and reopened', () => {
      beforeEach(() => {
        closeAndReopenMenu();
      });

      it('no longer says it failed', () => {
        expect(signOutError()).not.toBeInTheDocument();
      });
    });
  });

  describe('when the menu is closed and reopened with the sign-out on its way', () => {
    beforeEach(() => {
      mockedSignOut.mockReturnValue(new Promise(() => {}));

      fireEvent.click(signOutButton());
      closeAndReopenMenu();
    });

    it('keeps the way out dead, so it cannot be sent twice', () => {
      expect(signOutButton()).toBeDisabled();
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

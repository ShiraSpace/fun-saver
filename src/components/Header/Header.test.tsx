import { fireEvent, render, screen } from '@/test-utils/render';
import { mockAccountsContext, mockUser } from '@/test-utils/fixtures';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { Header } from './Header';
import { HEADER_TEST_IDS } from './constants';
import { getThemeTokens } from '@/theme/registry';
import { TITLE_TEST_IDS } from './CrossfadeTitle/constants';
import { MENU_TEST_IDS } from '../Menu/constants';
import { MENU_OVERLAY_TEST_IDS } from '../Menu/MenuOverlay/constants';
import { MENU_HEADER_SHEET_TEST_IDS } from '../Menu/MenuHeaderSheet/constants';
import { ACCOUNT_LIST_TEST_IDS } from '../Menu/AccountList/constants';
import { HOME_ROUTE } from '../Home/constants';
import { openAccountPicker } from '@/test-utils/account-picker';

const ACCOUNT_NAME = 'יעל';
const AVATAR_ID = 'kid-01';
const headerAccount = { name: ACCOUNT_NAME, avatarId: AVATAR_ID };

const GREETING = 'שלום';

function renderHeaderWithoutAccount(): void {
  render(<Header title={GREETING} />, {
    route: HOME_ROUTE,
    user: mockUser,
  });
}

function renderHeader(route: string): void {
  render(<Header title={ACCOUNT_NAME} account={headerAccount} />, {
    route,
    accounts: mockAccountsContext,
    user: mockUser,
  });
}

describe('Header', () => {
  describe('on home', () => {
    beforeEach(() => {
      renderHeader(HOME_ROUTE);
    });

    it('takes its ledge colour from the theme, never a colour of its own', () => {
      const bar = screen.getByTestId(HEADER_TEST_IDS.bar);

      expect(getComputedStyle(bar).boxShadow).toBe(
        `0 4px 0 ${getThemeTokens().shadows.faint}`
      );
    });

    it('shows the account name', () => {
      expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
        ACCOUNT_NAME
      );
    });

    it('contains the menu button', () => {
      expect(screen.getByTestId(MENU_TEST_IDS.menuButton)).toBeInTheDocument();
    });

    it('shows the account avatar', () => {
      const avatar = screen.getByTestId(HEADER_TEST_IDS.avatar);
      expect(avatar).toHaveAttribute('src', expect.stringContaining(AVATAR_ID));
    });

    it('offers no way home, this being home', () => {
      expect(
        screen.queryByTestId(HEADER_TEST_IDS.homeLink)
      ).not.toBeInTheDocument();
    });

    describe('the menu', () => {
      let button: HTMLElement;
      let overlay: HTMLElement;

      beforeEach(() => {
        button = screen.getByTestId(MENU_TEST_IDS.menuButton);
        overlay = screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay);
      });

      it('starts closed', () => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(overlay).toHaveAttribute('data-open', 'false');
      });

      it('opens the overlay when the menu button is clicked', () => {
        fireEvent.click(button);

        expect(button).toHaveAttribute('aria-expanded', 'true');
        expect(overlay).toHaveAttribute('data-open', 'true');
      });

      it('closes the overlay when the menu button is clicked again', () => {
        fireEvent.click(button);
        fireEvent.click(button);

        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(overlay).toHaveAttribute('data-open', 'false');
      });
    });

    describe('the bar under an open menu', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
      });

      it('keeps the account name rather than swapping in a menu title', () => {
        expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
          ACCOUNT_NAME
        );
      });

      it('takes the avatar away, the picker below already showing it', () => {
        expect(screen.getByTestId(HEADER_TEST_IDS.avatar)).not.toBeVisible();
      });
    });

    describe('the sheet behind the bar', () => {
      it('leaves the screen gradient alone while the menu is shut', () => {
        expect(
          screen.getByTestId(MENU_HEADER_SHEET_TEST_IDS.sheet)
        ).toHaveAttribute('data-open', 'false');
      });

      it('covers the gradient once the menu is open', () => {
        fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));

        expect(
          screen.getByTestId(MENU_HEADER_SHEET_TEST_IDS.sheet)
        ).toHaveAttribute('data-open', 'true');
      });

      it('sits outside the bar, which would otherwise paint over it', () => {
        expect(screen.getByTestId(HEADER_TEST_IDS.bar)).not.toContainElement(
          screen.getByTestId(MENU_HEADER_SHEET_TEST_IDS.sheet)
        );
      });
    });

    describe('reopening after the account list was left open', () => {
      beforeEach(() => {
        const openMenu = (): void => {
          fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
        };

        openMenu();
        openAccountPicker();
        openMenu();
        openMenu();
      });

      it('shows the account it is on rather than the whole list', () => {
        expect(
          screen.queryByTestId(ACCOUNT_LIST_TEST_IDS.list)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('on a screen that is not home', () => {
    beforeEach(() => {
      renderHeader(METHOD_ROUTE);
    });

    it('offers a way home', () => {
      expect(screen.getByTestId(HEADER_TEST_IDS.homeLink)).toHaveAttribute(
        'href',
        HOME_ROUTE
      );
    });

    it('keeps the avatar, which is itself the way home', () => {
      expect(screen.getByTestId(HEADER_TEST_IDS.homeLink)).toContainElement(
        screen.getByTestId(HEADER_TEST_IDS.avatar)
      );
    });

    it('takes the way home away under an open menu, as home does its avatar', () => {
      fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));

      expect(screen.getByTestId(HEADER_TEST_IDS.homeLink)).not.toBeVisible();
    });
  });

  describe('with no account, which is what the empty state has', () => {
    beforeEach(() => {
      renderHeaderWithoutAccount();
    });

    it('stands up all the same, so the burger is on every screen', () => {
      expect(screen.getByTestId(HEADER_TEST_IDS.bar)).toBeInTheDocument();
      expect(screen.getByTestId(MENU_TEST_IDS.menuButton)).toBeInTheDocument();
    });

    it('greets the parent where an account screen names the account', () => {
      expect(screen.getByTestId(TITLE_TEST_IDS.title)).toHaveTextContent(
        GREETING
      );
    });

    it('leaves the end of the bar bare, there being no account to picture', () => {
      expect(
        screen.queryByTestId(HEADER_TEST_IDS.avatar)
      ).not.toBeInTheDocument();
    });
  });
});

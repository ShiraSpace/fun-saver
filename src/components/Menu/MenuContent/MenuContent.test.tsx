import { render, screen, type RenderOptions } from '@/test-utils/render';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import {
  mockAccountsContext,
  mockChildAccountsContext,
} from '@/test-utils/mocks/account.mocks';
import { WithMenu } from '@/test-utils/menu';
import { VIEW_MODE } from '@/lib/account/view-mode';
import { MenuContent } from './MenuContent';
import { CHILD_MENU_CONTENT_TEST_IDS } from '../ChildMenuContent/constants';
import { NAVIGATION_TABS_TEST_IDS } from '../NavigationTabs/constants';
import { ACCOUNT_LIST_TEST_IDS } from '../AccountList/constants';
import { ACCOUNT_PICKER_TEST_IDS } from '../AccountPicker/constants';
import { EDIT_ACCOUNT_BUTTON_TEST_IDS } from '../EditAccountButton/constants';
import { MENU_ACCOUNT_SETTINGS_TEST_IDS } from '../MenuAccountSettings/constants';
import { MENU_GLOBAL_SETTINGS_TEST_IDS } from '../MenuGlobalSettings/constants';
import { MENU_USER_SETTINGS_TEST_IDS } from '../MenuUserSettings/constants';
import { VIEW_MODE_SWITCH_TEST_IDS } from '../ViewModeSwitch/constants';

function renderMenuContent(options: RenderOptions): void {
  render(
    <WithMenu>
      <MenuContent />
    </WithMenu>,
    options
  );
}

describe('MenuContent', () => {
  describe('for a parent who has no account yet', () => {
    beforeEach(() => {
      renderMenuContent({ user: mockUser });
    });

    it('offers to start an account where the picker would stand', () => {
      expect(
        screen.getByTestId(MENU_USER_SETTINGS_TEST_IDS.block)
      ).toContainElement(screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addAccount));
    });

    it('shows nothing that belongs to an account, there being none', () => {
      expect(
        screen.queryByTestId(ACCOUNT_PICKER_TEST_IDS.picker)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(EDIT_ACCOUNT_BUTTON_TEST_IDS.button)
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId(MENU_ACCOUNT_SETTINGS_TEST_IDS.block)
      ).not.toBeInTheDocument();
    });

    it('shows no global settings without an account', () => {
      expect(
        screen.queryByTestId(MENU_GLOBAL_SETTINGS_TEST_IDS.block)
      ).not.toBeInTheDocument();
    });
  });

  describe('for a parent viewing an account', () => {
    beforeEach(() => {
      renderMenuContent({ user: mockUser, accounts: mockAccountsContext });
    });

    it('leaves the picker to picking a child, with no switch beside it', () => {
      expect(
        screen.getByTestId(MENU_USER_SETTINGS_TEST_IDS.block)
      ).not.toContainElement(
        screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch)
      );
    });

    it("puts the settings for every child after the account's own", () => {
      const accountSettings = screen.getByTestId(
        MENU_ACCOUNT_SETTINGS_TEST_IDS.block
      );
      const globalSettings = screen.getByTestId(
        MENU_GLOBAL_SETTINGS_TEST_IDS.block
      );

      expect(accountSettings.nextElementSibling).toBe(globalSettings);
    });
  });

  describe('in parent mode, for an account saved in child view', () => {
    beforeEach(() => {
      renderMenuContent({
        user: mockUser,
        accounts: mockChildAccountsContext,
        viewMode: VIEW_MODE.parent,
      });
    });

    it('shows the parent menu', () => {
      expect(
        screen.getByTestId(ACCOUNT_PICKER_TEST_IDS.picker)
      ).toBeInTheDocument();
    });

    it('does not show the child menu', () => {
      expect(
        screen.queryByTestId(CHILD_MENU_CONTENT_TEST_IDS.menu)
      ).not.toBeInTheDocument();
    });
  });

  describe('in child mode with no account', () => {
    beforeEach(() => {
      renderMenuContent({ user: mockUser, viewMode: VIEW_MODE.child });
    });

    it('shows the parent menu, so the parent can start an account', () => {
      expect(
        screen.getByTestId(ACCOUNT_LIST_TEST_IDS.addAccount)
      ).toBeInTheDocument();
    });
  });

  describe('in child mode, for an account saved in parent view', () => {
    beforeEach(() => {
      renderMenuContent({
        user: mockUser,
        accounts: mockAccountsContext,
        viewMode: VIEW_MODE.child,
      });
    });

    it('shows the child menu', () => {
      expect(
        screen.getByTestId(CHILD_MENU_CONTENT_TEST_IDS.menu)
      ).toBeInTheDocument();
    });

    it('hides the account picker, so the child stays on their own money', () => {
      expect(
        screen.queryByTestId(ACCOUNT_PICKER_TEST_IDS.picker)
      ).not.toBeInTheDocument();
    });

    it('hides the screens meant for the parent', () => {
      expect(
        screen.queryByTestId(NAVIGATION_TABS_TEST_IDS.tabBar)
      ).not.toBeInTheDocument();
    });

    it('hides signing out', () => {
      expect(
        screen.queryByTestId(MENU_USER_SETTINGS_TEST_IDS.block)
      ).not.toBeInTheDocument();
    });
  });
});

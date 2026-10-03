import { render, screen } from '@/test-utils/render';
import { mockUser } from '@/test-utils/mocks/user.mocks';
import {
  mockAccountsContext,
  mockChildAccountsContext,
} from '@/test-utils/mocks/account.mocks';
import { WithMenu } from '@/test-utils/menu';
import { MenuContent } from './MenuContent';
import { CHILD_MENU_CONTENT_TEST_IDS } from '../ChildMenuContent/constants';
import { NAVIGATION_TABS_TEST_IDS } from '../NavigationTabs/constants';
import { ACCOUNT_LIST_TEST_IDS } from '../AccountList/constants';
import { ACCOUNT_PICKER_TEST_IDS } from '../AccountPicker/constants';
import { EDIT_ACCOUNT_BUTTON_TEST_IDS } from '../EditAccountButton/constants';
import { MENU_ACCOUNT_SETTINGS_TEST_IDS } from '../MenuAccountSettings/constants';
import { MENU_USER_SETTINGS_TEST_IDS } from '../MenuUserSettings/constants';
import { VIEW_MODE_SWITCH_TEST_IDS } from '../ViewModeSwitch/constants';

describe('MenuContent', () => {
  describe('for a parent who has no account yet', () => {
    beforeEach(() => {
      render(
        <WithMenu>
          <MenuContent />
        </WithMenu>,
        { user: mockUser }
      );
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
  });

  describe('for a parent viewing an account', () => {
    beforeEach(() => {
      render(
        <WithMenu>
          <MenuContent />
        </WithMenu>,
        { user: mockUser, accounts: mockAccountsContext }
      );
    });

    it("offers child view among this account's settings", () => {
      expect(
        screen.getByTestId(MENU_ACCOUNT_SETTINGS_TEST_IDS.block)
      ).toContainElement(screen.getByTestId(VIEW_MODE_SWITCH_TEST_IDS.switch));
    });
  });

  describe('for an account in child view', () => {
    beforeEach(() => {
      render(
        <WithMenu>
          <MenuContent />
        </WithMenu>,
        { user: mockUser, accounts: mockChildAccountsContext }
      );
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

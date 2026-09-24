import { fireEvent, render, screen } from '@/test-utils/render';
import { openAccountPicker } from '@/test-utils/account-picker';
import { mockAccountsContext, mockUser } from '@/test-utils/fixtures';
import { WithMenu } from '@/test-utils/menu';
import { MenuOverlay } from './MenuOverlay';
import { MENU_OVERLAY_COPY } from './constants';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { MENU_USER_SETTINGS_TEST_IDS } from '../MenuUserSettings/constants';
import { MENU_ACCOUNT_SETTINGS_TEST_IDS } from '../MenuAccountSettings/constants';
import { SIGNED_IN_USER_SECTION_TEST_IDS } from '../SignedInUserSection/constants';
import { APPEARANCE_SECTION_TEST_IDS } from '../AppearanceSection/constants';
import { LANGUAGE_SECTION_TEST_IDS } from '../LanguageSection/constants';
import { NAVIGATION_TABS_TEST_IDS } from '../NavigationTabs/constants';

const mockOnClose = jest.fn();

function renderOverlay(): void {
  mockOnClose.mockClear();
  render(
    <WithMenu closeMenu={mockOnClose}>
      <MenuOverlay />
    </WithMenu>,
    { accounts: mockAccountsContext, user: mockUser }
  );
}

describe('MenuOverlay', () => {
  describe('with the account picker shut', () => {
    beforeEach(() => {
      renderOverlay();
    });

    it('exposes the overlay as a labelled dialog', () => {
      expect(
        screen.getByRole('dialog', { name: MENU_OVERLAY_COPY.title })
      ).toBeInTheDocument();
    });

    it('calls onClose when Escape is pressed while open', () => {
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('keeps the account picker in the block that is not about one account', () => {
      expect(
        screen.getByTestId(MENU_USER_SETTINGS_TEST_IDS.block)
      ).toBeInTheDocument();
    });

    it('puts what is saved on the account inside the per-account block', () => {
      const accountScope = screen.getByTestId(
        MENU_ACCOUNT_SETTINGS_TEST_IDS.block
      );

      expect(accountScope).toContainElement(
        screen.getByTestId(APPEARANCE_SECTION_TEST_IDS.section)
      );
      expect(accountScope).toContainElement(
        screen.getByTestId(LANGUAGE_SECTION_TEST_IDS.section)
      );
    });

    it('puts the signed-in user in the block that is not about one account', () => {
      const strip = screen.getByTestId(SIGNED_IN_USER_SECTION_TEST_IDS.section);

      expect(
        screen.getByTestId(MENU_USER_SETTINGS_TEST_IDS.block)
      ).toContainElement(strip);
      expect(
        screen.getByTestId(MENU_ACCOUNT_SETTINGS_TEST_IDS.block)
      ).not.toContainElement(strip);
    });

    it('keeps navigation out of the settings that belong to one account', () => {
      const strip = screen.getByTestId(NAVIGATION_TABS_TEST_IDS.tabBar);

      expect(strip).toBeInTheDocument();
      expect(
        screen.getByTestId(MENU_ACCOUNT_SETTINGS_TEST_IDS.block)
      ).not.toContainElement(strip);
      expect(
        screen.getByTestId(MENU_USER_SETTINGS_TEST_IDS.block)
      ).not.toContainElement(strip);
    });

    it('offers a way out to the method page', () => {
      expect(
        screen.getByTestId(NAVIGATION_TABS_TEST_IDS.methodTab)
      ).toHaveAttribute('href', METHOD_ROUTE);
    });

    it('closes itself on the way there, so returning does not land on an open menu', () => {
      fireEvent.click(screen.getByTestId(NAVIGATION_TABS_TEST_IDS.methodTab));

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('with the account picker open', () => {
    beforeEach(() => {
      renderOverlay();
      openAccountPicker();
      fireEvent.keyDown(document.body, { key: 'Escape' });
    });

    it('keeps the Escape that shut the picker from closing the menu too', () => {
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});

import { Fragment, JSX } from 'react';
import { fireEvent, render, screen } from '@/test-utils/render';
import { openAccountPicker } from '@/test-utils/account-picker';
import { mockAccountsContext, mockMenu, mockUser } from '@/test-utils/fixtures';
import { MenuProvider, useMenuState } from '../use-menu-state';
import { MenuOverlay } from './MenuOverlay';
import { MENU_OVERLAY_CONTENT } from './constants';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { MENU_GLOBAL_SCOPE_TEST_IDS } from '../MenuGlobalScope/constants';
import { MENU_ACCOUNT_SCOPE_TEST_IDS } from '../MenuAccountScope/constants';
import { PROFILE_SECTION_TEST_IDS } from '../ProfileSection/constants';
import { APPEARANCE_SECTION_TEST_IDS } from '../AppearanceSection/constants';
import { LANGUAGE_SECTION_TEST_IDS } from '../LanguageSection/constants';
import { NAV_TABS_TEST_IDS } from '../NavTabs/constants';
import { ACCOUNT_PICKER_TEST_IDS } from '../AccountPicker/constants';

const onClose = jest.fn();
const TOGGLE_TESTID = 'toggle-menu';
const GOOGLE_PHOTO = 'https://lh3.googleusercontent.com/a/photo';

function ToggleableOverlay(): JSX.Element {
  const menu = useMenuState();

  return (
    <Fragment>
      <button data-testid={TOGGLE_TESTID} onClick={menu.toggle} />
      <MenuProvider value={menu}>
        <MenuOverlay />
      </MenuProvider>
    </Fragment>
  );
}

function toggleMenu(): void {
  fireEvent.click(screen.getByTestId(TOGGLE_TESTID));
}

function renderOverlay(): void {
  onClose.mockClear();
  render(
    <MenuProvider value={{ ...mockMenu, close: onClose }}>
      <MenuOverlay />
    </MenuProvider>,
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
        screen.getByRole('dialog', { name: MENU_OVERLAY_CONTENT.title })
      ).toBeInTheDocument();
    });

    it('calls onClose when Escape is pressed while open', () => {
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onClose).toHaveBeenCalled();
    });

    it('keeps the account picker in the block that is not about one account', () => {
      expect(
        screen.getByTestId(MENU_GLOBAL_SCOPE_TEST_IDS.block)
      ).toBeInTheDocument();
    });

    it('puts what is saved on the account inside the per-account block', () => {
      const accountScope = screen.getByTestId(
        MENU_ACCOUNT_SCOPE_TEST_IDS.block
      );

      expect(accountScope).toContainElement(
        screen.getByTestId(APPEARANCE_SECTION_TEST_IDS.section)
      );
      expect(accountScope).toContainElement(
        screen.getByTestId(LANGUAGE_SECTION_TEST_IDS.section)
      );
    });

    it('puts the signed-in user in the block that is not about one account', () => {
      const strip = screen.getByTestId(PROFILE_SECTION_TEST_IDS.strip);

      expect(
        screen.getByTestId(MENU_GLOBAL_SCOPE_TEST_IDS.block)
      ).toContainElement(strip);
      expect(
        screen.getByTestId(MENU_ACCOUNT_SCOPE_TEST_IDS.block)
      ).not.toContainElement(strip);
    });

    it('keeps navigation out of the settings that belong to one account', () => {
      const strip = screen.getByTestId(NAV_TABS_TEST_IDS.strip);

      expect(strip).toBeInTheDocument();
      expect(
        screen.getByTestId(MENU_ACCOUNT_SCOPE_TEST_IDS.block)
      ).not.toContainElement(strip);
      expect(
        screen.getByTestId(MENU_GLOBAL_SCOPE_TEST_IDS.block)
      ).not.toContainElement(strip);
    });

    it('offers a way out to the method page', () => {
      expect(screen.getByTestId(NAV_TABS_TEST_IDS.methodTab)).toHaveAttribute(
        'href',
        METHOD_ROUTE
      );
    });

    it('closes itself on the way there, so returning does not land on an open menu', () => {
      fireEvent.click(screen.getByTestId(NAV_TABS_TEST_IDS.methodTab));

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('with the account picker open', () => {
    beforeEach(() => {
      renderOverlay();
      openAccountPicker();
      fireEvent.keyDown(screen.getByTestId(ACCOUNT_PICKER_TEST_IDS.trigger), {
        key: 'Escape',
      });
    });

    it('keeps the Escape that shut the picker from closing the menu too', () => {
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('reopened after a photo failed to load', () => {
    beforeEach(() => {
      render(<ToggleableOverlay />, {
        accounts: mockAccountsContext,
        user: { ...mockUser, image: GOOGLE_PHOTO },
      });
      toggleMenu();
      fireEvent.error(screen.getByTestId(PROFILE_SECTION_TEST_IDS.photo));
      toggleMenu();
      toggleMenu();
    });

    it('starts fresh and tries the photo again', () => {
      expect(
        screen.getByTestId(PROFILE_SECTION_TEST_IDS.photo)
      ).toBeInTheDocument();
    });
  });
});

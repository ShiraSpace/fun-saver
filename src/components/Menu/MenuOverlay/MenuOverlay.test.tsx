import { fireEvent, renderWithAccounts, screen } from '@/test-utils/render';
import { MenuOverlay } from './MenuOverlay';
import { MENU_OVERLAY_CONTENT, MENU_OVERLAY_TEST_IDS } from './constants';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { MENU_GLOBAL_SCOPE_TEST_IDS } from '../MenuGlobalScope/constants';
import { MENU_ACCOUNT_SCOPE_TEST_IDS } from '../MenuAccountScope/constants';
import { APPEARANCE_SECTION_TEST_IDS } from '../AppearanceSection/constants';
import { LANGUAGE_SECTION_TEST_IDS } from '../LanguageSection/constants';

const onClose = jest.fn();
const onAccountListToggle = jest.fn();

function renderOverlay(isAccountListOpen = false): void {
  onClose.mockClear();
  onAccountListToggle.mockClear();
  renderWithAccounts(
    <MenuOverlay
      isOpen
      onClose={onClose}
      isAccountListOpen={isAccountListOpen}
      onAccountListToggle={onAccountListToggle}
    />
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

    it('offers a way out to the method page', () => {
      expect(
        screen.getByTestId(MENU_OVERLAY_TEST_IDS.methodLink)
      ).toHaveAttribute('href', METHOD_ROUTE);
    });

    it('closes itself on the way there, so returning does not land on an open menu', () => {
      fireEvent.click(screen.getByTestId(MENU_OVERLAY_TEST_IDS.methodLink));

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('with the account picker open', () => {
    beforeEach(() => {
      renderOverlay(true);
    });

    it('lets Escape shut the picker and leaves the menu standing', () => {
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(onAccountListToggle).toHaveBeenCalledWith(false);
      expect(onClose).not.toHaveBeenCalled();
    });
  });
});

import { fireEvent, render, screen } from '@/test-utils/render';
import { MenuOverlay } from './MenuOverlay';
import { MENU_OVERLAY_CONTENT, MENU_OVERLAY_TEST_IDS } from './constants';
import { METHOD_ROUTE } from '@/components/Method/constants';
import { ACCOUNTS_SECTION_TEST_IDS } from '../AccountsSection/constants';
import { APPEARANCE_SECTION_TEST_IDS } from '../AppearanceSection/constants';
import { LANGUAGE_SECTION_TEST_IDS } from '../LanguageSection/constants';

describe('MenuOverlay', () => {
  const onClose = jest.fn();
  const onAccountListToggle = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
    onAccountListToggle.mockClear();
    render(
      <MenuOverlay
        isOpen
        onClose={onClose}
        isAccountListOpen={false}
        onAccountListToggle={onAccountListToggle}
      />
    );
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

  it('renders the accounts, appearance and language sections', () => {
    expect(
      screen.getByTestId(ACCOUNTS_SECTION_TEST_IDS.section)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(APPEARANCE_SECTION_TEST_IDS.section)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(LANGUAGE_SECTION_TEST_IDS.section)
    ).toBeInTheDocument();
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

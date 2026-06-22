import { fireEvent, render, screen } from '@/test-support/render';
import { MenuOverlay } from './MenuOverlay';
import { MENU_OVERLAY_CONTENT } from './constants';
import { ACCOUNTS_SECTION_TEST_IDS } from '../AccountsSection/constants';
import { APPEARANCE_SECTION_TEST_IDS } from '../AppearanceSection/constants';
import { LANGUAGE_SECTION_TEST_IDS } from '../LanguageSection/constants';

describe('MenuOverlay', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    onClose.mockClear();
    render(<MenuOverlay isOpen onClose={onClose} />);
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
});

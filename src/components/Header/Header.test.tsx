import { fireEvent, render, screen } from '@/test-support/render';
import { Header } from './Header';
import { HEADER_TEST_IDS } from './constants';
import { MENU_TEST_IDS } from '../Menu/constants';
import { MENU_OVERLAY_TEST_IDS } from '../Menu/MenuOverlay/constants';

describe('Header', () => {
  const ACCOUNT_NAME = 'יעל';
  const AVATAR_ID = 'kid-01';

  beforeEach(() => {
    render(<Header name={ACCOUNT_NAME} avatarId={AVATAR_ID} />);
  });

  it('shows the account name', () => {
    expect(screen.getByTestId(HEADER_TEST_IDS.name)).toHaveTextContent(
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
});

import { fireEvent, render, screen } from '@/test-support/render';
import { Menu } from './Menu';
import { MENU_TEST_IDS } from './constants';
import { MENU_OVERLAY_TEST_IDS } from './MenuOverlay/constants';

describe('Menu', () => {
  let button: HTMLElement;

  beforeEach(() => {
    render(<Menu />);
    button = screen.getByTestId(MENU_TEST_IDS.menuButton);
  });

  it('renders the menu button', () => {
    expect(button).toBeInTheDocument();
  });

  it('toggles its open state when clicked', () => {
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  describe('the hamburger icon', () => {
    let icon: HTMLElement;

    beforeEach(() => {
      icon = screen.getByTestId(MENU_TEST_IDS.menuIcon);
    });

    it('sits inside the menu button', () => {
      expect(button).toContainElement(icon);
    });

    it('marks itself open on click to drive the morph animation', () => {
      expect(icon).toHaveAttribute('data-open', 'false');

      fireEvent.click(button);
      expect(icon).toHaveAttribute('data-open', 'true');
    });
  });

  describe('the menu overlay', () => {
    let overlay: HTMLElement;

    beforeEach(() => {
      overlay = screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay);
    });

    it('opens when the menu button is clicked', () => {
      expect(overlay).toHaveAttribute('data-open', 'false');

      fireEvent.click(button);

      expect(overlay).toHaveAttribute('data-open', 'true');
    });

    it('closes when the menu button is clicked again', () => {
      fireEvent.click(button);
      expect(overlay).toHaveAttribute('data-open', 'true');

      fireEvent.click(button);
      expect(overlay).toHaveAttribute('data-open', 'false');
    });
  });
});

import { fireEvent, render, screen } from '@/test-support/render';
import { Menu } from './Menu';
import { MENU_TEST_IDS } from './constants';
import { MENU_OVERLAY_TEST_IDS } from './MenuOverlay/constants';

describe('Menu', () => {
  beforeEach(() => {
    render(<Menu />);
  });

  it('renders the menu button', () => {
    expect(screen.getByTestId(MENU_TEST_IDS.menuButton)).toBeInTheDocument();
  });

  it('shows the hamburger icon inside the button', () => {
    const button = screen.getByTestId(MENU_TEST_IDS.menuButton);
    const icon = screen.getByTestId(MENU_TEST_IDS.menuIcon);

    expect(button).toContainElement(icon);
  });

  it('toggles its open state when clicked', () => {
    const button = screen.getByTestId(MENU_TEST_IDS.menuButton);
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the menu overlay when the menu button is clicked', () => {
    const overlay = screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay);
    expect(overlay).toHaveAttribute('data-open', 'false');

    fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));

    expect(overlay).toHaveAttribute('data-open', 'true');
  });

  it('marks the icon as open on click to drive the morph animation', () => {
    const button = screen.getByTestId(MENU_TEST_IDS.menuButton);
    const icon = screen.getByTestId(MENU_TEST_IDS.menuIcon);

    expect(icon).toHaveAttribute('data-open', 'false');

    fireEvent.click(button);
    expect(icon).toHaveAttribute('data-open', 'true');
  });
});

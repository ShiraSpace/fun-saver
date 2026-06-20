import { fireEvent, render, screen } from '@testing-library/react';
import { Menu } from './Menu';
import { MENU_TEST_IDS } from './constants';

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

  it('marks the icon as open on click to drive the morph animation', () => {
    const button = screen.getByTestId(MENU_TEST_IDS.menuButton);
    const icon = screen.getByTestId(MENU_TEST_IDS.menuIcon);

    expect(icon).toHaveAttribute('data-open', 'false');

    fireEvent.click(button);
    expect(icon).toHaveAttribute('data-open', 'true');
  });
});

import { fireEvent, render, screen } from '@/test-support/render';
import { Menu } from './Menu';
import { MENU_TEST_IDS } from './constants';
import { MENU_OVERLAY_TEST_IDS } from './MenuOverlay/constants';

describe('Menu', () => {
  const onOpenChange = jest.fn();

  beforeEach(() => {
    onOpenChange.mockClear();
  });

  it('renders the menu button', () => {
    render(<Menu isOpen={false} onToggle={onOpenChange} />);
    expect(screen.getByTestId(MENU_TEST_IDS.menuButton)).toBeInTheDocument();
  });

  it('renders the overlay', () => {
    render(<Menu isOpen={false} onToggle={onOpenChange} />);
    expect(
      screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay)
    ).toBeInTheDocument();
  });

  describe('when closed', () => {
    beforeEach(() => {
      render(<Menu isOpen={false} onToggle={onOpenChange} />);
    });

    it('marks the button as collapsed', () => {
      expect(screen.getByTestId(MENU_TEST_IDS.menuButton)).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });

    it('keeps the hamburger icon closed', () => {
      expect(screen.getByTestId(MENU_TEST_IDS.menuIcon)).toHaveAttribute(
        'data-open',
        'false'
      );
    });

    it('requests opening when clicked', () => {
      fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe('when open', () => {
    beforeEach(() => {
      render(<Menu isOpen onToggle={onOpenChange} />);
    });

    it('marks the button as expanded', () => {
      expect(screen.getByTestId(MENU_TEST_IDS.menuButton)).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('marks the icon open to drive the morph animation', () => {
      expect(screen.getByTestId(MENU_TEST_IDS.menuIcon)).toHaveAttribute(
        'data-open',
        'true'
      );
    });

    it('sits the icon inside the menu button', () => {
      const button = screen.getByTestId(MENU_TEST_IDS.menuButton);
      const icon = screen.getByTestId(MENU_TEST_IDS.menuIcon);
      expect(button).toContainElement(icon);
    });

    it('requests closing when clicked', () => {
      fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});

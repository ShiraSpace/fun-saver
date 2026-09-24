import { fireEvent, render, screen } from '@/test-utils/render';
import { MenuToggle } from './MenuToggle';
import { MENU_TEST_IDS } from '../constants';

const mockOnToggle = jest.fn();

describe('MenuToggle', () => {
  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  describe('when the menu is closed', () => {
    beforeEach(() => {
      render(<MenuToggle isOpen={false} onToggle={mockOnToggle} />);
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

    it('asks for the menu when clicked', () => {
      fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the menu is open', () => {
    beforeEach(() => {
      render(<MenuToggle isOpen onToggle={mockOnToggle} />);
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

    it('asks to put the menu away when clicked', () => {
      fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });
  });
});

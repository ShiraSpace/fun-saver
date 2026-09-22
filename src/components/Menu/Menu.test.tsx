import { JSX, useState } from 'react';
import { fireEvent, renderWithAccounts, screen } from '@/test-utils/render';
import { openAccountPicker } from '@/test-utils/account-picker';
import { Menu } from './Menu';
import { MENU_TEST_IDS } from './constants';
import { MENU_OVERLAY_TEST_IDS } from './MenuOverlay/constants';
import { ACCOUNT_LIST_TEST_IDS } from './AccountList/constants';

describe('Menu', () => {
  const onToggle = jest.fn();

  beforeEach(() => {
    onToggle.mockClear();
  });

  describe('when closed', () => {
    beforeEach(() => {
      renderWithAccounts(<Menu isOpen={false} onToggle={onToggle} />);
    });

    it('renders the menu button', () => {
      expect(screen.getByTestId(MENU_TEST_IDS.menuButton)).toBeInTheDocument();
    });

    it('renders the overlay', () => {
      expect(
        screen.getByTestId(MENU_OVERLAY_TEST_IDS.overlay)
      ).toBeInTheDocument();
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
      expect(onToggle).toHaveBeenCalledWith(true);
    });
  });

  describe('when open', () => {
    beforeEach(() => {
      renderWithAccounts(<Menu isOpen onToggle={onToggle} />);
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
      expect(onToggle).toHaveBeenCalledWith(false);
    });
  });

  describe('reopening after the account list was left open', () => {
    function StatefulMenu(): JSX.Element {
      const [isOpen, setIsOpen] = useState(false);

      return <Menu isOpen={isOpen} onToggle={setIsOpen} />;
    }

    function clickBurger(): void {
      fireEvent.click(screen.getByTestId(MENU_TEST_IDS.menuButton));
    }

    beforeEach(() => {
      renderWithAccounts(<StatefulMenu />);
      clickBurger();
      openAccountPicker();
      clickBurger();
      clickBurger();
    });

    it('shows the account it is on rather than the whole list', () => {
      expect(
        screen.queryByTestId(ACCOUNT_LIST_TEST_IDS.list)
      ).not.toBeInTheDocument();
    });
  });
});

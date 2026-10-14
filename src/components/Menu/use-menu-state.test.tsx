import { JSX } from 'react';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import { menuToggle, toggleMenu, WithToggleableMenu } from '@/test-utils/menu';
import { useMenu, useOnMenuClose } from './use-menu-state';

const mockOnMenuClose = jest.fn();

describe('useOnMenuClose', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderHook(() => useOnMenuClose(mockOnMenuClose), {
      wrapper: WithToggleableMenu,
    });
  });

  it('stays quiet for a menu that has never been opened', () => {
    expect(mockOnMenuClose).not.toHaveBeenCalled();
  });

  it('answers once when the menu closes', () => {
    toggleMenu();
    toggleMenu();

    expect(mockOnMenuClose).toHaveBeenCalledTimes(1);
  });
});

describe('closing the menu', () => {
  const mockCloseMenuTestId = 'mock-close-menu';

  function CloseMenuButton(): JSX.Element {
    const { closeMenu } = useMenu();

    return <button data-testid={mockCloseMenuTestId} onClick={closeMenu} />;
  }

  it('puts the focus on the menu toggle', () => {
    render(
      <WithToggleableMenu>
        <CloseMenuButton />
      </WithToggleableMenu>
    );
    toggleMenu();

    fireEvent.click(screen.getByTestId(mockCloseMenuTestId));

    expect(menuToggle()).toHaveFocus();
  });
});

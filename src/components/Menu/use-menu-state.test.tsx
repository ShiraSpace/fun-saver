import { renderHook } from '@testing-library/react';
import { toggleMenu, WithToggleableMenu } from '@/test-utils/menu';
import { useOnMenuClose } from './use-menu-state';

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

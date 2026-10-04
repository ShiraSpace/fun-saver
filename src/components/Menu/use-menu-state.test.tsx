import { act, renderHook } from '@testing-library/react';
import { toggleMenu, WithToggleableMenu } from '@/test-utils/menu';
import { useMenuState, useOnMenuClose } from './use-menu-state';

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

describe('whenMenuCloses', () => {
  const mockStep = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('while the menu is open', () => {
    it('waits for the menu to close before taking the step', () => {
      const { result } = renderHook(() => useMenuState());
      act(() => result.current.toggle());

      act(() => result.current.whenMenuCloses(mockStep));
      expect(mockStep).not.toHaveBeenCalled();

      act(() => result.current.closeMenu());
      expect(mockStep).toHaveBeenCalledTimes(1);
    });
  });

  describe('once the menu has closed', () => {
    it('takes the step at once', () => {
      const { result } = renderHook(() => useMenuState());

      act(() => result.current.whenMenuCloses(mockStep));

      expect(mockStep).toHaveBeenCalledTimes(1);
    });
  });
});

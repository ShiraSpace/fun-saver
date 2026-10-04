import { act, renderHook } from '@testing-library/react';
import { toggleMenu, WithToggleableMenu } from '@/test-utils/menu';
import { type MenuState, useMenuState, useOnMenuClose } from './use-menu-state';

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

interface RenderedMenuState {
  current: MenuState;
}

function renderMenuState(): RenderedMenuState {
  return renderHook(() => useMenuState()).result;
}

describe('useMenuState whenMenuCloses', () => {
  const mockStep = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('given a step while the menu is open', () => {
    let menu: RenderedMenuState;

    beforeEach(() => {
      menu = renderMenuState();
      act(() => menu.current.toggle());
      act(() => menu.current.whenMenuCloses(mockStep));
    });

    it('waits for the menu to close', () => {
      expect(mockStep).not.toHaveBeenCalled();
    });

    describe('and the menu closes', () => {
      beforeEach(() => {
        act(() => menu.current.closeMenu());
      });

      it('takes the step once', () => {
        expect(mockStep).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('given a step once the menu has closed', () => {
    beforeEach(() => {
      const menu = renderMenuState();
      act(() => menu.current.whenMenuCloses(mockStep));
    });

    it('takes the step at once', () => {
      expect(mockStep).toHaveBeenCalledTimes(1);
    });
  });
});

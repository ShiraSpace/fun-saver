import { StrictMode } from 'react';
import { renderHook } from '@testing-library/react';
import { historySettles, pressBack } from '@/test-utils/history';
import { useCloseOnBack } from '../use-close-on-back';
import { DRAWER_HISTORY_KEY } from '../constants';

describe('useCloseOnBack', () => {
  beforeEach(async () => {
    await historySettles();
    window.history.replaceState(null, '');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('pushes a history entry while open', () => {
    renderHook(() => useCloseOnBack(jest.fn()));

    expect(window.history.state?.[DRAWER_HISTORY_KEY]).toBeDefined();
  });

  it('closes on back', async () => {
    const mockOnClose = jest.fn();
    renderHook(() => useCloseOnBack(mockOnClose));

    await pressBack();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('stops listening after it closes', async () => {
    const mockOnClose = jest.fn();
    const { unmount } = renderHook(() => useCloseOnBack(mockOnClose));

    unmount();
    await pressBack();

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('stays open under StrictMode remount', async () => {
    const mockOnClose = jest.fn();

    renderHook(() => useCloseOnBack(mockOnClose), { wrapper: StrictMode });
    await historySettles();

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('closes when the back button lands on another drawer entry', async () => {
    const mockOnClose = jest.fn();
    window.history.replaceState({ [DRAWER_HISTORY_KEY]: 'mock-leftover-entry' }, '');
    renderHook(() => useCloseOnBack(mockOnClose));

    await pressBack();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('removes its history entry when it closes without the back button', async () => {
    const { unmount } = renderHook(() => useCloseOnBack(jest.fn()));

    unmount();
    await historySettles();

    expect(window.history.state?.[DRAWER_HISTORY_KEY]).toBeUndefined();
  });

  it('returns to the page entry once the back button closed it', async () => {
    const { unmount } = renderHook(() => useCloseOnBack(jest.fn()));
    await pressBack();

    unmount();
    await historySettles();

    expect(window.history.state?.[DRAWER_HISTORY_KEY]).toBeUndefined();
  });

  it('keeps its history entry when it refuses to close', async () => {
    renderHook(() => useCloseOnBack(jest.fn()));

    await pressBack();

    expect(window.history.state?.[DRAWER_HISTORY_KEY]).toBeDefined();
  });

  it('removes the entry it took over from a modal closing in the same moment', async () => {
    const closing = renderHook(() => useCloseOnBack(jest.fn()));
    closing.unmount();
    const { unmount } = renderHook(() => useCloseOnBack(jest.fn()));

    unmount();
    await historySettles();

    expect(window.history.state?.[DRAWER_HISTORY_KEY]).toBeUndefined();
  });

  describe('with another modal open below it', () => {
    it('closes only the top one on back', async () => {
      const mockOnCloseBelow = jest.fn();
      renderHook(() => useCloseOnBack(mockOnCloseBelow));
      renderHook(() => useCloseOnBack(jest.fn()));

      await pressBack();

      expect(mockOnCloseBelow).not.toHaveBeenCalled();
    });

    it('leaves the one below open when the top one closes by its own button', async () => {
      const mockOnCloseBelow = jest.fn();
      renderHook(() => useCloseOnBack(mockOnCloseBelow));
      const { unmount } = renderHook(() => useCloseOnBack(jest.fn()));

      unmount();
      await historySettles();

      expect(mockOnCloseBelow).not.toHaveBeenCalled();
    });

    it('closes the one below on the next back once the top one closed by its own button', async () => {
      const mockOnCloseBelow = jest.fn();
      renderHook(() => useCloseOnBack(mockOnCloseBelow));
      const { unmount } = renderHook(() => useCloseOnBack(jest.fn()));
      unmount();
      await historySettles();

      await pressBack();

      expect(mockOnCloseBelow).toHaveBeenCalledTimes(1);
    });
  });
});

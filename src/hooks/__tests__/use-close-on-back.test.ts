import { StrictMode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { useCloseOnBack } from '../use-close-on-back';
import { DRAWER_HISTORY_KEY } from '../constants';
import { HISTORY_TRAVERSAL_MS } from './constants';

const historySettles = (): Promise<void> =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, HISTORY_TRAVERSAL_MS));
  });

describe('useCloseOnBack', () => {
  beforeEach(async () => {
    await historySettles();
    window.history.replaceState(null, '');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('pushes a history entry of its own while open', () => {
    renderHook(() => useCloseOnBack(jest.fn()));

    expect(typeof window.history.state?.[DRAWER_HISTORY_KEY]).toBe('string');
  });

  it('closes when the back button fires a popstate', () => {
    const mockOnClose = jest.fn();
    renderHook(() => useCloseOnBack(mockOnClose));

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('stops listening after it closes', () => {
    const mockOnClose = jest.fn();
    const { unmount } = renderHook(() => useCloseOnBack(mockOnClose));

    unmount();
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

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
    window.history.replaceState(
      { [DRAWER_HISTORY_KEY]: 'mock-leftover-entry' },
      ''
    );
    renderHook(() => useCloseOnBack(mockOnClose));

    window.history.back();
    await historySettles();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('removes its history entry when it closes without the back button', async () => {
    const { unmount } = renderHook(() => useCloseOnBack(jest.fn()));

    unmount();
    await historySettles();

    expect(window.history.state?.[DRAWER_HISTORY_KEY]).toBeUndefined();
  });

  it('leaves history alone when the back button closed it', async () => {
    const { unmount } = renderHook(() => useCloseOnBack(jest.fn()));
    window.history.back();
    await historySettles();
    const mockHistoryBack = jest.spyOn(window.history, 'back');

    unmount();

    expect(mockHistoryBack).not.toHaveBeenCalled();
  });
});

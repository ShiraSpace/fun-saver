import { StrictMode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { useCloseOnBack } from './use-close-on-back';

const flushAsync = (): Promise<void> =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

describe('useCloseOnBack', () => {
  it('pushes a history entry while open', () => {
    renderHook(() => useCloseOnBack(jest.fn()));

    expect(window.history.state?.funsaverDrawer).toBe(true);
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
    const mockHistoryBack = jest
      .spyOn(window.history, 'back')
      .mockImplementation(() => {
        setTimeout(
          () => window.dispatchEvent(new PopStateEvent('popstate')),
          0
        );
      });

    renderHook(() => useCloseOnBack(mockOnClose), { wrapper: StrictMode });
    await flushAsync();

    expect(mockOnClose).not.toHaveBeenCalled();

    mockHistoryBack.mockRestore();
  });
});

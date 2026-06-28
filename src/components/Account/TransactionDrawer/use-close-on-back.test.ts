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
    const onClose = jest.fn();
    renderHook(() => useCloseOnBack(onClose));

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('stops listening after it closes', () => {
    const onClose = jest.fn();
    const { unmount } = renderHook(() => useCloseOnBack(onClose));

    unmount();
    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('stays open under StrictMode remount', async () => {
    const onClose = jest.fn();
    const back = jest.spyOn(window.history, 'back').mockImplementation(() => {
      setTimeout(() => window.dispatchEvent(new PopStateEvent('popstate')), 0);
    });

    renderHook(() => useCloseOnBack(onClose), { wrapper: StrictMode });
    await flushAsync();

    expect(onClose).not.toHaveBeenCalled();

    back.mockRestore();
  });
});

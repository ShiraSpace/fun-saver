import { renderHook, act } from '@testing-library/react';
import { useCloseOnBack } from './use-close-on-back';

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
});

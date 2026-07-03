import type { PointerEvent as ReactPointerEvent } from 'react';
import { renderHook, act } from '@testing-library/react';
import { useSwipeToClose } from './use-swipe-to-close';
import { SWIPE_TO_CLOSE } from './constants';

const pointerEventAt = (clientY: number): ReactPointerEvent<HTMLElement> =>
  ({
    clientY,
    pointerId: 1,
    currentTarget: { setPointerCapture: jest.fn() },
  }) as unknown as ReactPointerEvent<HTMLElement>;

const dragBy = (
  result: { current: ReturnType<typeof useSwipeToClose> },
  distance: number
): void => {
  act(() => result.current.onPointerDown(pointerEventAt(0)));
  act(() => result.current.onPointerMove(pointerEventAt(distance)));
  act(() => result.current.onPointerUp(pointerEventAt(distance)));
};

describe('useSwipeToClose', () => {
  it('closes when dragged past the threshold', () => {
    const onClose = jest.fn();
    const { result } = renderHook(() => useSwipeToClose(onClose));

    dragBy(result, SWIPE_TO_CLOSE.closeThreshold + 1);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when dragged less than the threshold', () => {
    const onClose = jest.fn();
    const { result } = renderHook(() => useSwipeToClose(onClose));

    dragBy(result, SWIPE_TO_CLOSE.closeThreshold - 1);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('ignores upward drags', () => {
    const onClose = jest.fn();
    const { result } = renderHook(() => useSwipeToClose(onClose));

    dragBy(result, -200);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('snaps the offset back to zero after release', () => {
    const { result } = renderHook(() => useSwipeToClose(jest.fn()));

    dragBy(result, SWIPE_TO_CLOSE.closeThreshold + 1);

    expect(result.current.offset).toBe(0);
  });

  it('tracks the downward offset while dragging', () => {
    const { result } = renderHook(() => useSwipeToClose(jest.fn()));

    act(() => result.current.onPointerDown(pointerEventAt(0)));
    act(() => result.current.onPointerMove(pointerEventAt(40)));

    expect(result.current.offset).toBe(40);
    expect(result.current.isDragging).toBe(true);
  });
});

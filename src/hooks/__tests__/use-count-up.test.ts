import { act, renderHook } from '@testing-library/react';
import { prefersMotion, prefersReducedMotion } from '@/test-utils/motion';
import { useCountUp } from '../use-count-up';

describe('useCountUp', () => {
  const mockTiming = { startDelayMs: 0, countMs: 1600 };

  describe('when the browser allows motion', () => {
    const halfTheCount = mockTiming.countMs / 2;

    beforeEach(() => {
      prefersMotion();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('starts from startAt on mount', () => {
      const { result } = renderHook(() =>
        useCountUp({ startAt: 100, to: 500, timing: mockTiming })
      );

      expect(result.current).toBe(100);
    });

    it('is halfway from startAt to the amount halfway through the count', () => {
      const { result } = renderHook(() =>
        useCountUp({ startAt: 100, to: 500, timing: mockTiming })
      );

      act(() => jest.advanceTimersByTime(halfTheCount));

      expect(result.current).toBe(300);
    });

    it('counts a new amount from the number on screen', () => {
      const { result, rerender } = renderHook(
        ({ to }) => useCountUp({ startAt: 0, to, timing: mockTiming }),
        { initialProps: { to: 500 } }
      );
      act(() => jest.advanceTimersByTime(halfTheCount));

      rerender({ to: 900 });

      expect(result.current).toBe(250);
    });

    it('stays on startAt while the start delay runs', () => {
      const mockDelayedTiming = { startDelayMs: 200, countMs: 1600 };
      const { result } = renderHook(() =>
        useCountUp({ startAt: 100, to: 500, timing: mockDelayedTiming })
      );

      act(() => jest.advanceTimersByTime(mockDelayedTiming.startDelayMs / 2));

      expect(result.current).toBe(100);
    });

    it('stops on the amount when the count ends between two frames', () => {
      const mockTimingEndingBetweenFrames = { startDelayMs: 0, countMs: 1000 };
      const { result } = renderHook(() =>
        useCountUp({ startAt: 100, to: 500, timing: mockTimingEndingBetweenFrames })
      );

      act(() => jest.advanceTimersByTime(mockTimingEndingBetweenFrames.countMs * 2));

      expect(result.current).toBe(500);
    });
  });

  it('shows the amount at once when the browser asks for reduced motion', () => {
    prefersReducedMotion();

    const { result } = renderHook(() => useCountUp({ startAt: 100, to: 500, timing: mockTiming }));

    expect(result.current).toBe(500);
  });
});

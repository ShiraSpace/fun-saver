import { renderHook } from '@testing-library/react';
import { prefersMotion, prefersReducedMotion } from '@/test-utils/motion';
import {
  progressAt,
  useCountUpTotalBalance,
} from './use-count-up-total-balance';
import { TOTAL_ANIMATION } from './constants';

const totalBalanceAgorot = 35900;

describe('useCountUpTotalBalance', () => {
  it('starts from nothing when the browser allows motion', () => {
    prefersMotion();

    const { result } = renderHook(() =>
      useCountUpTotalBalance(totalBalanceAgorot)
    );
    const nothing = 0;

    expect(result.current).toBe(nothing);
  });

  it('shows the whole total straight away when the browser asks for reduced motion', () => {
    prefersReducedMotion();

    const { result } = renderHook(() =>
      useCountUpTotalBalance(totalBalanceAgorot)
    );

    expect(result.current).toBe(totalBalanceAgorot);
  });
});

describe('progressAt', () => {
  it('has not started while the delay is still running', () => {
    const duringTheDelay = TOTAL_ANIMATION.startDelayMs / 2;
    const notStarted = 0;

    expect(progressAt(duringTheDelay)).toBe(notStarted);
  });

  it('is halfway once half the counting time has passed', () => {
    const halfwayThrough =
      TOTAL_ANIMATION.startDelayMs + TOTAL_ANIMATION.countMs / 2;
    const halfway = 0.5;

    expect(progressAt(halfwayThrough)).toBe(halfway);
  });

  it('never passes complete', () => {
    const longAfterTheEnd = TOTAL_ANIMATION.countMs * 10;
    const complete = 1;

    expect(progressAt(longAfterTheEnd)).toBe(complete);
  });
});

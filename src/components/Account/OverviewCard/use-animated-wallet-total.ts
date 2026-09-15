'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { motionIsReduced } from '@/theme/motion';
import { TOTAL_ANIMATION } from './constants';

const NOT_STARTED = 0;
const COMPLETE = 1;
const NO_TIME_PASSED = 0;

const useBeforePaint =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

export function progressAt(elapsedMs: number): number {
  const countingMs = elapsedMs - TOTAL_ANIMATION.startDelayMs;

  return Math.min(
    Math.max(countingMs, NO_TIME_PASSED) / TOTAL_ANIMATION.countMs,
    COMPLETE
  );
}

function useAnimationProgress(): number {
  const [progress, setProgress] = useState(COMPLETE);

  useBeforePaint(() => {
    if (motionIsReduced()) {
      return;
    }

    setProgress(NOT_STARTED);

    const startedAt = performance.now();
    let frame = 0;

    const step = (now: number): void => {
      const reached = progressAt(now - startedAt);

      setProgress(reached);

      if (reached < COMPLETE) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);

    return (): void => cancelAnimationFrame(frame);
  }, []);

  return progress;
}

export function useAnimatedWalletTotal(total: number): number {
  const progress = useAnimationProgress();

  return Math.round(total * progress);
}

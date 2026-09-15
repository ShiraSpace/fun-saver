'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { REDUCED_MOTION } from '@/theme/motion';
import { TOTAL_ANIMATION } from './constants';

const NOT_STARTED = 0;
const COMPLETE = 1;
const NO_TIME_PASSED = 0;

const useBeforePaint =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

function useAnimationProgress(): number {
  const [progress, setProgress] = useState(COMPLETE);

  useBeforePaint(() => {
    if (window.matchMedia(REDUCED_MOTION).matches) {
      return;
    }

    setProgress(NOT_STARTED);

    const startedAt = performance.now();
    let frame = 0;

    const step = (now: number): void => {
      const countingMs = now - startedAt - TOTAL_ANIMATION.startDelayMs;
      const reached = Math.min(
        Math.max(countingMs, NO_TIME_PASSED) / TOTAL_ANIMATION.countMs,
        COMPLETE
      );

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

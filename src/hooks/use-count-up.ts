'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motionIsReduced } from '@/theme/motion';

const COMPLETE = 1;
const NO_TIME_PASSED = 0;

const useBeforePaint = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export interface CountUpTiming {
  startDelayMs: number;
  countMs: number;
}

interface CountUpParams {
  startAt: number;
  to: number;
  timing: CountUpTiming;
}

function progressAt(elapsedMs: number, timing: CountUpTiming): number {
  const countingMs = elapsedMs - timing.startDelayMs;

  return Math.min(Math.max(countingMs, NO_TIME_PASSED) / timing.countMs, COMPLETE);
}

export function useCountUp({ startAt, to, timing }: CountUpParams): number {
  const [shown, setShown] = useState(to);
  const numberOnScreen = useRef(startAt);

  useBeforePaint(() => {
    const from = numberOnScreen.current;

    if (motionIsReduced() || from === to) {
      numberOnScreen.current = to;
      setShown(to);
      return;
    }

    setShown(from);

    const startedAt = performance.now();
    let frame = 0;

    const step = (now: number): void => {
      const progress = progressAt(now - startedAt, timing);

      numberOnScreen.current = Math.round(from + (to - from) * progress);
      setShown(numberOnScreen.current);

      if (progress < COMPLETE) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);

    return (): void => cancelAnimationFrame(frame);
  }, [to, timing]);

  return shown;
}

import { css, type Keyframes, type SerializedStyles } from '@emotion/react';

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export function motionIsReduced(): boolean {
  return window.matchMedia(REDUCED_MOTION).matches;
}

export const EASING = {
  linear: 'linear',
  easeOut: 'ease-out',
} as const;

interface Entrance {
  keyframes: Keyframes;
  durationMs: number;
  delayMs: number;
  easing: string;
}

export function entrance({
  keyframes,
  durationMs,
  delayMs,
  easing,
}: Entrance): SerializedStyles {
  return css`
    animation-name: ${keyframes};
    animation-duration: ${durationMs}ms;
    animation-timing-function: ${easing};
    animation-fill-mode: backwards;
    animation-delay: ${delayMs}ms;

    @media ${REDUCED_MOTION} {
      animation: none;
    }
  `;
}

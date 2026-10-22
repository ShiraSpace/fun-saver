import { css, type Keyframes, type SerializedStyles } from '@emotion/react';

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export function motionIsReduced(): boolean {
  return window.matchMedia(REDUCED_MOTION).matches;
}

export function canAnimate(): boolean {
  return typeof Element.prototype.animate === 'function' && !motionIsReduced();
}

export const EASING = {
  linear: 'linear',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
} as const;

interface Entrance {
  keyframes: Keyframes;
  durationMs: number;
  delayMs: number;
  easing: string;
}

export function entrance({ keyframes, durationMs, delayMs, easing }: Entrance): SerializedStyles {
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

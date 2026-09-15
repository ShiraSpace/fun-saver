import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { DONUT_CIRCUMFERENCE, DONUT_STYLE } from '../constants';

export const Svg = styled.svg`
  display: block;
  transform: rotate(${DONUT_STYLE.rotation}deg);

  circle {
    fill: none;
    stroke-linecap: butt;
    stroke-width: ${DONUT_STYLE.strokeWidth};
  }
`;

const drawArc = keyframes`
  from {
    stroke-dasharray: 0 ${DONUT_CIRCUMFERENCE};
  }
`;

interface ArcTiming {
  durationMs: number;
  delayMs: number;
}

export const ArcCircle = styled.circle<ArcTiming>`
  animation-name: ${drawArc};
  animation-duration: ${({ durationMs }): number => durationMs}ms;
  animation-timing-function: linear;
  animation-fill-mode: backwards;
  animation-delay: ${({ delayMs }): number => delayMs}ms;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

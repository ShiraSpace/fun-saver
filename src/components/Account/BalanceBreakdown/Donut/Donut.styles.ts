import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import type { SerializedStyles } from '@emotion/react';
import { EASING, entrance } from '@/theme/motion';
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
  ${({ durationMs, delayMs }): SerializedStyles =>
    entrance({
      keyframes: drawArc,
      durationMs,
      delayMs,
      easing: EASING.linear,
    })}
`;

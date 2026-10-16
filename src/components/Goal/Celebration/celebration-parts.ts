import { css, keyframes, type SerializedStyles, type Theme } from '@emotion/react';
import { REDUCED_MOTION } from '@/theme/motion';
import { CELEBRATION_MOTION, TRAVELLING_BORDER_ANGLE } from './constants';

const travel = keyframes`
  to { ${TRAVELLING_BORDER_ANGLE}: 360deg; }
`;

const settle = keyframes`
  to { opacity: 0; }
`;

const hop = keyframes`
  0%, 100% { transform: translateY(0) rotate(0); }
  30% { transform: translateY(-7px) rotate(-8deg); }
  60% { transform: translateY(0) rotate(6deg); }
`;

const sweep = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -100% 0; }
`;

function borderColours(theme: Theme): string {
  const { celebrationWhite, celebrationBorderLight, celebrationBorderMain } = theme.colors;
  const { celebrationBorderAccent, celebrationBorderDeep } = theme.colors;

  return `conic-gradient(
    from var(${TRAVELLING_BORDER_ANGLE}, 0deg),
    ${celebrationWhite} 0deg,
    ${celebrationBorderLight} 30deg,
    ${celebrationBorderMain} 70deg,
    ${celebrationBorderAccent} 180deg,
    ${celebrationBorderDeep} 250deg,
    ${celebrationBorderMain} 320deg,
    ${celebrationWhite} 360deg
  )`;
}

export function travellingBorder(theme: Theme, cornerRadius: number): SerializedStyles {
  return css`
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      inset: -5px;
      z-index: -1;
      border-radius: ${cornerRadius + 5}px;
      background: ${borderColours(theme)};
      animation:
        ${travel} 2000ms linear 0ms 5,
        ${settle} ${CELEBRATION_MOTION.fadeMs}ms ease-in ${CELEBRATION_MOTION.fadeDelayMs}ms
          forwards;
    }

    &::after {
      inset: -8px;
      filter: blur(16px);
      opacity: ${theme.celebrationGlow};
    }

    @media ${REDUCED_MOTION} {
      &::before,
      &::after {
        display: none;
      }
    }
  `;
}

export function wobble(delayMs: number): SerializedStyles {
  return css`
    animation: ${hop} 800ms ease-in-out ${delayMs}ms 12;

    @media ${REDUCED_MOTION} {
      animation: none;
    }
  `;
}

export function shine(theme: Theme): SerializedStyles {
  return css`
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        100deg,
        transparent 30%,
        ${theme.colors.celebrationShine} 50%,
        transparent 70%
      );
      background-size: 200% 100%;
      background-repeat: no-repeat;
      animation: ${sweep} 1400ms linear 0ms 7 both;
    }

    @media ${REDUCED_MOTION} {
      &::after {
        display: none;
      }
    }
  `;
}

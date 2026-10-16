import { css, keyframes, type SerializedStyles, type Theme } from '@emotion/react';
import { REDUCED_MOTION } from '@/theme/motion';
import { CELEBRATION_MOTION } from './constants';

const travel = keyframes`
  to { --travellingBorderAngle: 360deg; }
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

export function travellingBorder(theme: Theme, cornerRadius: number): SerializedStyles {
  const { celebrationShine, celebrationGold, celebrationPink, celebrationPurple } = theme.colors;

  return css`
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      inset: -5px;
      z-index: -1;
      border-radius: ${cornerRadius + 5}px;
      background: conic-gradient(
        from var(--travellingBorderAngle),
        ${celebrationShine} 0deg,
        ${celebrationGold} 70deg,
        ${celebrationPink} 180deg,
        ${celebrationPurple} 250deg,
        ${celebrationGold} 320deg,
        ${celebrationShine} 360deg
      );
      animation:
        ${travel} 2000ms linear 0ms 5,
        ${settle} ${CELEBRATION_MOTION.fadeMs}ms ease-in ${CELEBRATION_MOTION.fadeDelayMs}ms
          forwards;
    }

    &::after {
      inset: -8px;
      filter: blur(16px);
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

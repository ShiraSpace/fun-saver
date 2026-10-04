import {
  css,
  keyframes,
  type SerializedStyles,
  type Theme,
} from '@emotion/react';
import styled from '@emotion/styled';
import { LAYERS } from '@/theme/layers';
import { REDUCED_MOTION } from '@/theme/motion';
import type { ThemeColors } from '@/theme/theme-tokens';
import { CELEBRATION_MOTION, type CelebrationPiece } from './constants';

const fall = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(var(--sway), 26vh) rotate(180deg); }
  50% { transform: translate(0, 53vh) rotate(360deg); }
  75% { transform: translate(calc(var(--sway) * -1), 79vh) rotate(540deg); }
  100% { transform: translate(0, 108vh) rotate(720deg); }
`;

const fadeAway = keyframes`
  to { opacity: 0; }
`;

export const Falling = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${LAYERS.celebration};
  overflow: hidden;
  pointer-events: none;
  animation-name: ${fadeAway};
  animation-duration: ${CELEBRATION_MOTION.fadeMs}ms;
  animation-timing-function: ease-in;
  animation-delay: ${CELEBRATION_MOTION.fadeDelayMs}ms;
  animation-fill-mode: forwards;

  @media ${REDUCED_MOTION} {
    display: none;
  }
`;

interface PieceLook {
  piece: CelebrationPiece;
  colorName: keyof ThemeColors;
}

interface ThemedPieceLook extends PieceLook {
  theme: Theme;
}

function pieceLook({
  piece,
  colorName,
  theme,
}: ThemedPieceLook): SerializedStyles {
  const [rightPercent, widthPx, heightPx, fallMs, delayMs, swayPx] = piece;

  return css`
    --sway: ${swayPx}px;
    right: ${rightPercent}%;
    width: ${widthPx}px;
    height: ${heightPx}px;
    background: ${theme.colors[colorName]};
    animation-duration: ${fallMs}ms;
    animation-delay: ${delayMs}ms;
  `;
}

export const Piece = styled.i<PieceLook>`
  position: absolute;
  top: -20px;
  border-radius: 2px;
  opacity: 0.9;
  animation-name: ${fall};
  animation-timing-function: linear;
  animation-iteration-count: 1;
  animation-fill-mode: both;
  ${pieceLook}
`;

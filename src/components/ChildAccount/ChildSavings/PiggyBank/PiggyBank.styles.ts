import { css, keyframes, type SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { REDUCED_MOTION } from '@/theme/motion';
import { PIGGY_BANK_SHAPE } from './constants';
import { afterTheCelebrationWait } from '@/components/Goal/Celebration/celebration-parts';

const hop = keyframes`
  0%,
  100% {
    transform: translateY(0) scale(1, 1);
  }
  20% {
    transform: translateY(0) scale(1.08, 0.9);
  }
  50% {
    transform: translateY(-22px) scale(0.95, 1.06);
  }
  80% {
    transform: translateY(0) scale(1.06, 0.94);
  }
`;

const HOP_MS = 700;
const HOP_DELAY_MS = 200;
const HOPS = 3;

export const PiggyBankDrawing = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
`;

function hopsWhenGoalReached({
  isGoalReached,
}: {
  isGoalReached: boolean;
}): SerializedStyles | false {
  const { cx, cy } = PIGGY_BANK_SHAPE.shadow;

  return (
    isGoalReached &&
    css`
      transform-origin: ${cx}px ${cy}px;
      animation: ${hop} ${HOP_MS}ms ease-in-out ${afterTheCelebrationWait(HOP_DELAY_MS)} ${HOPS};

      @media ${REDUCED_MOTION} {
        animation: none;
      }
    `
  );
}

export const PiggyBankBody = styled.g<{ isGoalReached: boolean }>`
  ${hopsWhenGoalReached}
`;

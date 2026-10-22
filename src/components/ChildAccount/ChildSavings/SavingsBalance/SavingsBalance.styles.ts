import { css, keyframes, type SerializedStyles, type Theme } from '@emotion/react';
import styled from '@emotion/styled';
import { readByScreenReaderOnly } from '@/theme/accessibility';
import { REDUCED_MOTION } from '@/theme/motion';
import { afterTheCelebrationWait } from '@/components/Goal/Celebration/celebration-parts';
import { BALANCE_CELEBRATION_START_MS } from './constants';

const bump = keyframes`
  50% {
    transform: scale(1.18);
  }
`;

const goldFlash = keyframes`
  30% {
    text-shadow: 0 0 18px var(--gold), 0 0 4px var(--gold);
  }
`;

const BUMP_MS = 500;
const BUMPS = 2;
const GOLD_FLASH_MS = 2400;

interface CelebratingBalance {
  celebrating: boolean;
  theme: Theme;
}

function bumpsAndFlashesGold({ celebrating, theme }: CelebratingBalance): SerializedStyles | false {
  return (
    celebrating &&
    css`
      --gold: ${theme.colors.celebrationGold};
      animation:
        ${bump} ${BUMP_MS}ms ease-out ${afterTheCelebrationWait(BALANCE_CELEBRATION_START_MS)}
          ${BUMPS},
        ${goldFlash} ${GOLD_FLASH_MS}ms ease-out
          ${afterTheCelebrationWait(BALANCE_CELEBRATION_START_MS)} 1;

      @media ${REDUCED_MOTION} {
        animation: none;
      }
    `
  );
}

export const Balance = styled.div`
  position: relative;
  margin: 2px 0 0;
  font-size: ${({ theme }): number => theme.typography.display}px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const ShownBalance = styled.span<{ celebrating: boolean }>`
  display: inline-block;
  ${bumpsAndFlashesGold}
`;

export const AnnouncedBalance = styled.div`
  ${readByScreenReaderOnly}
`;

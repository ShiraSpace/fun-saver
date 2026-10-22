import styled from '@emotion/styled';
import type { SerializedStyles } from '@emotion/react';
import {
  celebrationOutline,
  travellingBorder,
} from '@/components/Goal/Celebration/celebration-parts';

const CARD_RADIUS = 22;

export const Card = styled.section<{ celebrating: boolean }>`
  padding: 8px 18px 18px;
  text-align: center;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: ${CARD_RADIUS}px;
  box-shadow: 0 5px 0 ${({ theme }): string => theme.shadows.faint}${celebrationOutline};
  ${({ celebrating, theme }): SerializedStyles | false =>
    celebrating && travellingBorder(theme, CARD_RADIUS)}
`;

export const PiggyBankSpace = styled.div`
  position: relative;
  width: 50%;
  margin: 0 auto 4px;
`;

export const GoalSpace = styled.div`
  margin: 8px 2px 0;
  text-align: start;
`;

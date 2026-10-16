import styled from '@emotion/styled';
import type { Themed } from '@/theme/themed';

interface NoteProps extends Themed {
  isGoalReached: boolean;
}

const background = ({ isGoalReached, theme }: NoteProps): string =>
  isGoalReached ? theme.colors.gainSoftBg : theme.tints.film;

const border = ({ isGoalReached, theme }: NoteProps): string =>
  isGoalReached
    ? `1.5px solid ${theme.colors.gainText}`
    : `1.5px dashed ${theme.colors.textOnPrimary}`;

const color = ({ isGoalReached, theme }: NoteProps): string =>
  isGoalReached ? theme.colors.gainText : theme.colors.textOnPrimary;

export const Note = styled.p<{ isGoalReached: boolean }>`
  box-sizing: border-box;
  display: flex;
  gap: 8px;
  width: 100%;
  margin: 0;
  padding: 10px 12px;
  border: ${border};
  border-radius: 16px;
  background: ${background};
  font-size: 13px;
  line-height: 1.5;
  text-align: start;
  color: ${color};
`;

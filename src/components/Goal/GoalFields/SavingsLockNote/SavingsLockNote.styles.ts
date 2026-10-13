import styled from '@emotion/styled';
import type { Themed } from '@/theme/themed';

interface NoteProps extends Themed {
  reached: boolean;
}

const background = ({ reached, theme }: NoteProps): string =>
  reached ? theme.colors.gainSoftBg : theme.tints.film;

const border = ({ reached, theme }: NoteProps): string =>
  reached ? `1.5px solid ${theme.colors.gainText}` : `1.5px dashed ${theme.colors.textOnPrimary}`;

const color = ({ reached, theme }: NoteProps): string =>
  reached ? theme.colors.gainText : theme.colors.textOnPrimary;

export const Note = styled.p<{ reached: boolean }>`
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

import styled from '@emotion/styled';
import type { Themed } from '@/theme/themed';

const pictureTileFill = ({ theme }: Themed): string => theme.colors.softBg;
const chosenRing = ({ theme }: Themed): string => theme.colors.selectionRing;
const chosenTickColor = ({ theme }: Themed): string =>
  theme.colors.textOnPrimary;
const labelSize = ({ theme }: Themed): number => theme.typography.label;

export const PictureTileButton = styled.button`
  position: relative;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: ${pictureTileFill};
  font-size: 40px;
  cursor: pointer;

  &[aria-pressed='true'] {
    outline: 3px solid ${chosenRing};
    outline-offset: 2px;
  }

  &[aria-pressed='true']::after {
    content: '✓';
    position: absolute;
    inset-block-start: 6px;
    inset-inline-end: 6px;
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: ${chosenRing};
    color: ${chosenTickColor};
    font-size: ${labelSize}px;
    font-weight: 700;
  }
`;

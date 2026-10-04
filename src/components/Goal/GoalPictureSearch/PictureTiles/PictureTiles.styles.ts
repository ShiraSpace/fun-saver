import styled from '@emotion/styled';
import type { Themed } from '@/theme/themed';

const pictureTileFill = ({ theme }: Themed): string => theme.colors.softBg;
const chosenRing = ({ theme }: Themed): string => theme.colors.selectionRing;
const chosenTickColor = ({ theme }: Themed): string =>
  theme.colors.textOnPrimary;
const reasonColor = ({ theme }: Themed): string => theme.colors.textMuted;
const failedToLoadColor = ({ theme }: Themed): string => theme.colors.alertText;
const bodySize = ({ theme }: Themed): number => theme.typography.body;
const labelSize = ({ theme }: Themed): number => theme.typography.label;

export const FoundPictures = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-content: start;
  gap: 6px;
  aspect-ratio: 1;
  min-height: 0;
  padding: 4px;
  overflow-y: auto;
`;

export const PictureTile = styled.button`
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

export const NoPicturesReason = styled.p<{ failedToLoad: boolean }>`
  margin: 0;
  padding: 24px 8px;
  text-align: center;
  font-size: ${bodySize}px;
  font-weight: 600;
  color: ${(props): string =>
    props.failedToLoad ? failedToLoadColor(props) : reasonColor(props)};
`;

import styled from '@emotion/styled';
import type { Themed } from '@/theme/themed';

const tileFill = ({ theme }: Themed): string => theme.colors.softBg;
const ring = ({ theme }: Themed): string => theme.colors.selectionRing;
const tickText = ({ theme }: Themed): string => theme.colors.textOnPrimary;
const mutedText = ({ theme }: Themed): string => theme.colors.textMuted;
const alertText = ({ theme }: Themed): string => theme.colors.alertText;
const bodySize = ({ theme }: Themed): number => theme.typography.body;
const labelSize = ({ theme }: Themed): number => theme.typography.label;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-content: start;
  gap: 6px;
  aspect-ratio: 1;
  padding: 4px;
  overflow-y: auto;
`;

export const Tile = styled.button`
  position: relative;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  padding: 0;
  border: none;
  border-radius: 12px;
  background: ${tileFill};
  font-size: 40px;
  cursor: pointer;

  &[aria-pressed='true'] {
    outline: 3px solid ${ring};
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
    background: ${ring};
    color: ${tickText};
    font-size: ${labelSize}px;
    font-weight: 700;
  }
`;

export const StateLine = styled.p<{ isAlert: boolean }>`
  margin: 0;
  padding: 24px 8px;
  text-align: center;
  font-size: ${bodySize}px;
  font-weight: 600;
  color: ${(props): string =>
    props.isAlert ? alertText(props) : mutedText(props)};
`;

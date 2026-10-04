import styled from '@emotion/styled';
import { LAYERS } from '@/theme/layers';
import { SCREEN_LAYOUT } from '@/components/Screen/constants';
import type { Themed } from '@/theme/themed';

const shade = ({ theme }: Themed): string => theme.tints.shade;
const surface = ({ theme }: Themed): string => theme.colors.surface;
const deepShadow = ({ theme }: Themed): string => theme.shadows.deep;
const strongText = ({ theme }: Themed): string => theme.colors.textStrong;
const mutedText = ({ theme }: Themed): string => theme.colors.textMuted;
const searchFill = ({ theme }: Themed): string => theme.colors.walletTrack;
const headingSize = ({ theme }: Themed): number => theme.typography.heading;
const bodySize = ({ theme }: Themed): number => theme.typography.body;

export const Scrim = styled.div`
  position: fixed;
  inset: 0;
  background: ${shade};
  z-index: ${LAYERS.modalForeground};
`;

export const Sheet = styled.div`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: ${LAYERS.modalForeground};
  width: 100%;
  max-width: ${SCREEN_LAYOUT.maxWidth}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 14px 18px;
  background: ${surface};
  border-radius: 26px 26px 0 0;
  box-shadow: 0 -10px 30px ${deepShadow};
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SheetTitle = styled.h2`
  margin: 0;
  font-size: ${headingSize}px;
  font-weight: 800;
  color: ${strongText};
`;

export const CloseButton = styled.button`
  padding: 4px;
  border: none;
  background: transparent;
  font-size: ${headingSize}px;
  color: ${mutedText};
  cursor: pointer;
`;

export const SearchBox = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 14px;
  outline: none;
  background: ${searchFill};
  font: inherit;
  font-size: ${bodySize}px;
  font-weight: 600;
  color: ${strongText};
`;

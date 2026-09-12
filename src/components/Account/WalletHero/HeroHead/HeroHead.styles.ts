import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { HERO_STYLE } from '../constants';

const tileGradient = ({ theme }: { theme: Theme }): string =>
  theme.gradients.sunnyTile;

export const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${HERO_STYLE.headGap}px;
  text-align: start;
`;

export const IconTile = styled.div`
  flex-shrink: 0;
  width: ${HERO_STYLE.iconTileSize}px;
  height: ${HERO_STYLE.iconTileSize}px;
  border-radius: ${HERO_STYLE.iconTileRadius}px;
  background: ${tileGradient};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${HERO_STYLE.iconFontSize}px;
`;

export const Titles = styled.div`
  flex: 1;
`;

export const Eyebrow = styled.div`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  letter-spacing: 0.6px;
  color: ${({ theme }): string => theme.colors.accent};
`;

export const NameLine = styled.div`
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 700;
  margin-top: 2px;
`;

export const Meta = styled.div`
  font-size: ${({ theme }): number => theme.typography.label}px;
  color: ${({ theme }): string => theme.colors.textMuted};
  margin-top: 2px;
`;

import styled from '@emotion/styled';
import { COIN_ROW_STYLE } from './constants';

export const Row = styled.div`
  margin-top: ${COIN_ROW_STYLE.marginTop}px;
  padding: ${COIN_ROW_STYLE.paddingY}px ${COIN_ROW_STYLE.paddingX}px;
  border-radius: ${COIN_ROW_STYLE.radius}px;
  background: ${({ theme }): string => theme.colors.softBg};
  border: 1.5px dashed ${({ theme }): string => theme.colors.softBorder};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${COIN_ROW_STYLE.gap}px;
`;

export const Label = styled.span`
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.softText};
`;

export const Coins = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${COIN_ROW_STYLE.coinGap}px;
  direction: ltr;
`;

export const Coin = styled.span<{ half?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ half }): number =>
    half ? COIN_ROW_STYLE.coinSize / 2 : COIN_ROW_STYLE.coinSize}px;
  height: ${COIN_ROW_STYLE.coinSize}px;
  background: ${COIN_ROW_STYLE.coinGradient};
  border: 1.5px solid ${COIN_ROW_STYLE.coinBorder};
  color: ${COIN_ROW_STYLE.coinGlyphColor};
  font-size: ${COIN_ROW_STYLE.coinGlyphSize}px;
  font-weight: 800;
  overflow: hidden;
  border-radius: ${({ half }): string =>
    half
      ? `0 ${COIN_ROW_STYLE.coinSize}px ${COIN_ROW_STYLE.coinSize}px 0`
      : '50%'};
`;

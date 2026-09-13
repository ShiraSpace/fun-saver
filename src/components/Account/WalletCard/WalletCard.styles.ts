import styled from '@emotion/styled';
import type { WalletName } from '@/lib/types';
import { WALLET_CARD_STYLE, WALLET_GRADIENT } from './constants';

export const Card = styled.div`
  display: flex;
  align-items: center;
  gap: ${WALLET_CARD_STYLE.gap}px;
  padding: ${WALLET_CARD_STYLE.paddingY}px ${WALLET_CARD_STYLE.paddingX}px;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: ${WALLET_CARD_STYLE.radius}px;
  box-shadow: ${WALLET_CARD_STYLE.shadow};
`;

export const Illust = styled.span<{ name: WalletName }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${WALLET_CARD_STYLE.illustSize}px;
  height: ${WALLET_CARD_STYLE.illustSize}px;
  border-radius: ${WALLET_CARD_STYLE.illustRadius}px;
  font-size: ${WALLET_CARD_STYLE.illustFontSize}px;
  background: ${({ name, theme }): string =>
    theme.gradients[WALLET_GRADIENT[name]]};
`;

export const Name = styled.span`
  flex: 1;
  text-align: start;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const Pill = styled.span`
  padding: ${WALLET_CARD_STYLE.pillPaddingY}px
    ${WALLET_CARD_STYLE.pillPaddingX}px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.depositBg};
  border: 1.5px solid ${({ theme }): string => theme.colors.softBorder};
  font-size: ${({ theme }): number => theme.typography.body}px;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

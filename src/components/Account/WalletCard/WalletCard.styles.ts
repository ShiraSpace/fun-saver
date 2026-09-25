import styled from '@emotion/styled';
import type { WalletName } from '@/lib/wallet/types';
import { WALLET_GRADIENT } from '@/theme/wallet-gradient';
import { WALLET_CARD_STYLE } from './constants';

export const Card = styled.div`
  padding: ${WALLET_CARD_STYLE.paddingY}px ${WALLET_CARD_STYLE.paddingX}px;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: ${WALLET_CARD_STYLE.radius}px;
  box-shadow: 0 3px 0 ${({ theme }): string => theme.shadows.faint};
`;

export const Head = styled.div`
  display: flex;
  align-items: center;
  gap: ${WALLET_CARD_STYLE.gap}px;
`;

export const WalletIcon = styled.span<{ walletName: WalletName }>`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${WALLET_CARD_STYLE.iconSize}px;
  height: ${WALLET_CARD_STYLE.iconSize}px;
  border-radius: ${WALLET_CARD_STYLE.iconRadius}px;
  font-size: ${WALLET_CARD_STYLE.iconFontSize}px;
  background: ${({ walletName, theme }): string =>
    theme.gradients[WALLET_GRADIENT[walletName]]};
`;

export const Name = styled.span`
  flex: 1;
  text-align: start;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const Summary = styled.small`
  display: block;
  font-size: ${WALLET_CARD_STYLE.summarySize}px;
  font-weight: 500;
  color: ${({ theme }): string => theme.colors.textMuted};
  margin-top: ${WALLET_CARD_STYLE.summaryGap}px;
`;

export const Balance = styled.span`
  padding: ${WALLET_CARD_STYLE.balancePaddingY}px
    ${WALLET_CARD_STYLE.balancePaddingX}px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.depositBg};
  border: 1.5px solid ${({ theme }): string => theme.colors.softBorder};
  font-size: ${({ theme }): number => theme.typography.body}px;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

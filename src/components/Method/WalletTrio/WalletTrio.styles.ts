import styled from '@emotion/styled';
import type { WalletName } from '@/lib/types';
import { WALLET_GRADIENT } from '@/theme/wallet-gradient';

export const Trio = styled.div`
  display: flex;
  gap: 9px;
  margin-bottom: 14px;
`;

export const Pot = styled.div<{ walletName: WalletName }>`
  flex: 1;
  padding: 11px 9px;
  border-radius: 14px;
  text-align: center;
  background: ${({ walletName, theme }): string =>
    theme.gradients[WALLET_GRADIENT[walletName]]};
  color: ${({ theme }): string => theme.colors.textOnPot};
`;

export const Icon = styled.span`
  display: block;
  font-size: ${({ theme }): number => theme.typography.title}px;
`;

export const Name = styled.span`
  display: block;
  margin-top: 3px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
`;

export const Share = styled.span`
  display: block;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 600;
`;

import styled from '@emotion/styled';
import type { WalletName } from '@/lib/wallet/types';
import { WALLET_GRADIENT } from '@/theme/wallet-gradient';

export const DepositIcon = styled.span`
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  background: ${({ theme }): string => theme.colors.depositBg};
`;

export const WalletIcon = styled(DepositIcon)<{ walletName: WalletName }>`
  background: ${({ walletName, theme }): string =>
    theme.gradients[WALLET_GRADIENT[walletName]]};
`;

export const Badge = styled.span`
  position: absolute;
  inset-inline-end: -5px;
  inset-block-end: -5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  font-size: ${({ theme }): number => theme.typography.label}px;
  background: ${({ theme }): string => theme.colors.surface};
  border: 1.5px solid ${({ theme }): string => theme.colors.divider};
  box-shadow: 0 1px 3px ${({ theme }): string => theme.shadows.soft};
`;

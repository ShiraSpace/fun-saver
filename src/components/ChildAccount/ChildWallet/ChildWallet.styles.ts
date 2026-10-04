import styled from '@emotion/styled';
import type { WalletName } from '@/lib/wallet/types';
import { WALLET_GRADIENT } from '@/theme/wallet-gradient';

export const Card = styled.section`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 92px;
  padding: 14px 16px;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: 22px;
  box-shadow: 0 5px 0 ${({ theme }): string => theme.shadows.faint};
`;

export const Icon = styled.span<{ walletName: WalletName }>`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  font-size: ${({ theme }): number => theme.typography.amount}px;
  background: ${({ walletName, theme }): string =>
    theme.gradients[WALLET_GRADIENT[walletName]]};
`;

export const Name = styled.span`
  flex: 1;
  text-align: start;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const Note = styled.small`
  display: block;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 500;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Amount = styled.span`
  font-size: ${({ theme }): number => theme.typography.amount}px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

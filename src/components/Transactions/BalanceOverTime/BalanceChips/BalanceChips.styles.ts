import styled from '@emotion/styled';
import type { WalletName } from '@/lib/wallet/types';
import { WALLET_CHART_COLOR } from '../constants';
import { BalanceChip } from '../chip-parts';

export const Chips = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 9px;
`;

export const TotalBalanceChip = styled(BalanceChip)`
  &[aria-pressed='true'] {
    background: ${({ theme }): string => theme.colors.textStrong};
    border-color: ${({ theme }): string => theme.colors.textStrong};
    color: ${({ theme }): string => theme.colors.surface};
  }
`;

export const Swatch = styled.span<{ walletName: WalletName }>`
  flex-shrink: 0;
  width: 9px;
  height: 9px;
  border-radius: 3px;
  background: ${({ walletName, theme }): string =>
    theme.colors[WALLET_CHART_COLOR[walletName]]};
`;

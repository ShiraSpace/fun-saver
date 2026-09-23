import styled from '@emotion/styled';
import { WALLET_LIST_STYLE } from './constants';

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${WALLET_LIST_STYLE.gap}px;
`;

export const Label = styled.span`
  align-self: flex-start;
  text-align: start;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.labelScrim};
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textOnPrimary};
`;

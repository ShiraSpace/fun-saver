import styled from '@emotion/styled';
import { WALLET_LIST_STYLE } from './constants';

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${WALLET_LIST_STYLE.gap}px;
`;

export const Label = styled.span`
  text-align: start;
  padding-inline: ${WALLET_LIST_STYLE.labelPaddingX}px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textOnPrimary};
  opacity: ${WALLET_LIST_STYLE.labelOpacity};
`;

import styled from '@emotion/styled';
import { TRANSACTION_DRAWER_STYLE } from './constants';

export const DrawerTitle = styled.span`
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const DrawerError = styled.span`
  margin-top: ${TRANSACTION_DRAWER_STYLE.messageGap}px;
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.alertText};
`;

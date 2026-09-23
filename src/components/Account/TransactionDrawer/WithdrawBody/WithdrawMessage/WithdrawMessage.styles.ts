import styled from '@emotion/styled';
import { TRANSACTION_DRAWER_STYLE } from '../../constants';

export const Overdraft = styled.span`
  margin-top: ${TRANSACTION_DRAWER_STYLE.messageGap}px;
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.alertText};
  background: ${({ theme }): string => theme.colors.alertSoftBg};
  border-radius: 12px;
  padding: 7px 10px;
`;

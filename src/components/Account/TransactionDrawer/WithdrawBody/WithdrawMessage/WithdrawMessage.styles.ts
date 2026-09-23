import styled from '@emotion/styled';

export const Overdraft = styled.span`
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.alertText};
  background: ${({ theme }): string => theme.colors.alertSoftBg};
  border-radius: 12px;
  padding: 7px 10px;
`;

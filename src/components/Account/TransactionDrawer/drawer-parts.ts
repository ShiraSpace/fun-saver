import styled from '@emotion/styled';

export const DrawerTitle = styled.span`
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const DrawerError = styled.span`
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.accent};
`;

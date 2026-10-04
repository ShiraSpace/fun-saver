import styled from '@emotion/styled';

export const SaveError = styled.span`
  display: block;
  margin-top: 8px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  color: ${({ theme }): string => theme.colors.alertText};
`;

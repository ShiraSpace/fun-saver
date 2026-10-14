import styled from '@emotion/styled';

export const Label = styled.span`
  padding: 6px 14px;
  border-radius: 999px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  background: ${({ theme }): string => theme.colors.surface};
  color: ${({ theme }): string => theme.colors.gainText};
`;

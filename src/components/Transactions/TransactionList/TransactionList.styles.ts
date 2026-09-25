import styled from '@emotion/styled';

export const Card = styled.section`
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: 24px;
  padding: 11px 0 14px;
  box-shadow: 0 6px 0 ${({ theme }): string => theme.shadows.faint};
  color: ${({ theme }): string => theme.colors.textStrong};
  text-align: start;
`;

export const EmptyMessage = styled.p`
  margin: 0;
  padding: 28px 16px;
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.label}px;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

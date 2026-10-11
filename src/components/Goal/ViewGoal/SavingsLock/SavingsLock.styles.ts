import styled from '@emotion/styled';

export const Label = styled.span<{ reached: boolean }>`
  padding: 6px 14px;
  border-radius: 999px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  background: ${({ reached, theme }): string =>
    reached ? theme.colors.surface : theme.tints.film};
  color: ${({ reached, theme }): string =>
    reached ? theme.colors.gainText : theme.colors.textOnPrimary};
`;

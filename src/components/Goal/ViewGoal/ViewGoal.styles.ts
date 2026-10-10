import styled from '@emotion/styled';

export const Page = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 420px;
  padding: 22px 14px;
`;

export const ReachedHeading = styled.p`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: ${({ theme }): string => theme.colors.textOnPrimary};
`;

export const Badge = styled.span<{ reached: boolean }>`
  padding: 6px 14px;
  border-radius: 999px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  background: ${({ reached, theme }): string =>
    reached ? theme.colors.surface : theme.tints.film};
  color: ${({ reached, theme }): string =>
    reached ? theme.colors.gainText : theme.colors.textOnPrimary};
`;

import styled from '@emotion/styled';

export const Track = styled.div`
  display: flex;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.divider};
`;

export const Pill = styled.button<{ active: boolean }>`
  flex: 1;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  padding: 7px 0;
  border-radius: 999px;
  background: ${({ theme, active }): string =>
    active ? theme.colors.surface : 'transparent'};
  color: ${({ theme, active }): string =>
    active ? theme.colors.textStrong : theme.colors.textMuted};
`;

export const Arrow = styled.span<{ tone: 'in' | 'out' }>`
  margin-inline-start: 5px;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 800;
  color: ${({ theme, tone }): string =>
    tone === 'in' ? theme.colors.gainText : theme.colors.alert};
`;

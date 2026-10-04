import styled from '@emotion/styled';

export const Row = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 56px;
  padding: 12px;
  border: 1.5px solid ${({ theme }): string => theme.colors.softBorder};
  border-radius: 18px;
  background: ${({ theme }): string => theme.colors.surface};
  font: inherit;
  font-size: ${({ theme }): number => theme.typography.body}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  &[data-compact='true'] {
    width: auto;
    min-height: 48px;
    padding: 8px 16px;
    border-color: ${({ theme }): string => theme.colors.divider};
    border-radius: 999px;
    font-weight: 600;
    color: ${({ theme }): string => theme.colors.textMuted};
  }
`;

export const Icon = styled.span`
  font-size: ${({ theme }): number => theme.typography.title}px;
`;

export const Label = styled.span`
  flex: 1;
  text-align: start;
`;

export const Note = styled.small`
  display: block;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

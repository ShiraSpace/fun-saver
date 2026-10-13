import styled from '@emotion/styled';

export const Sources = styled.div`
  display: grid;
  flex: 1;
  gap: 6px;
`;

export const Source = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border: 1.5px solid ${({ theme }): string => theme.colors.primary};
  border-radius: 12px;
  background: ${({ theme }): string => theme.colors.softBg};
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.textStrong};
  cursor: pointer;

  &:disabled {
    border-style: dashed;
    border-color: ${({ theme }): string => theme.colors.divider};
    background: transparent;
    color: ${({ theme }): string => theme.colors.textMuted};
    cursor: default;
  }
`;

export const Soon = styled.span`
  margin-inline-start: auto;
  padding: 1px 8px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.softBg};
  font-size: 11px;
`;

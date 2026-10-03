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

export const Track = styled.span`
  position: relative;
  flex-shrink: 0;
  width: 48px;
  height: 28px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.divider};

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    inset-inline-start: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${({ theme }): string => theme.colors.surface};
  }

  &[data-on='true'] {
    background: ${({ theme }): string => theme.colors.primary};
  }

  &[data-on='true']::after {
    inset-inline-start: 23px;
  }
`;

export const SaveError = styled.span`
  display: block;
  margin-top: 8px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  color: ${({ theme }): string => theme.colors.alertText};
`;

import styled from '@emotion/styled';

export const Bubble = styled.div`
  position: relative;
  margin: 12px 0 18px;
  padding: 12px 13px;
  border: 2px solid ${({ theme }): string => theme.colors.primary};
  border-radius: 16px;
  background: ${({ theme }): string => theme.colors.surface};

  &:last-child {
    margin-bottom: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -9px;
    inset-inline-start: 26px;
    width: 14px;
    height: 14px;
    background: ${({ theme }): string => theme.colors.surface};
    border-left: 2px solid ${({ theme }): string => theme.colors.primary};
    border-bottom: 2px solid ${({ theme }): string => theme.colors.primary};
    transform: rotate(-45deg);
  }
`;

export const Label = styled.div`
  margin-bottom: 9px;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: ${({ theme }): string => theme.colors.primary};
`;

export const Line = styled.p`
  margin: 0;
  font-size: ${({ theme }): number => theme.typography.body}px;
  line-height: 1.75;
  color: ${({ theme }): string => theme.colors.textStrong};

  & + & {
    margin-top: 9px;
  }

  &[data-tone='struck'] {
    color: ${({ theme }): string => theme.colors.textMuted};
    text-decoration: line-through;
    text-decoration-color: ${({ theme }): string => theme.colors.alert};
    text-decoration-thickness: 1.5px;
  }

  &[data-tone='muted'] {
    color: ${({ theme }): string => theme.colors.textMuted};
  }
`;

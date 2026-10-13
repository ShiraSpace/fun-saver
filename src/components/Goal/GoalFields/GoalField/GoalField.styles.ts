import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';

interface CardProps {
  invalid: boolean;
  theme: Theme;
}

const cardBorder = ({ invalid, theme }: CardProps): string =>
  invalid ? theme.colors.alert : 'transparent';

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const Card = styled.label<{ invalid: boolean }>`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 12px 14px;
  border: 2px solid ${cardBorder};
  border-radius: 14px;
  background: ${({ theme }): string => theme.colors.surface};
  box-shadow: 0 4px 0 ${({ theme }): string => theme.shadows.faint};
  color: ${({ theme }): string => theme.colors.textMuted};
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font: inherit;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const FieldError = styled.span`
  align-self: flex-start;
  padding: 2px 10px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.alertSoftBg};
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.alertText};
`;

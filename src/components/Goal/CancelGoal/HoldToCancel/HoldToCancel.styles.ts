import styled from '@emotion/styled';
import type { Themed } from '@/theme/themed';
import { HOLD_TO_CANCEL } from './constants';

const alertText = ({ theme }: Themed): string => theme.colors.alertText;

export const HoldButton = styled.button`
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 11px;
  border: 2px solid ${alertText};
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.surface};
  color: ${alertText};
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;

  &:focus-visible {
    outline: 3px solid ${({ theme }): string => theme.colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    background: ${alertText};
    color: ${({ theme }): string => theme.colors.textOnPrimary};
    cursor: default;
  }
`;

export const Fill = styled.span`
  position: absolute;
  inset: 0;
  background: ${({ theme }): string => theme.colors.alert};
  opacity: 0.3;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 250ms ease-out;

  &[data-filling='true'] {
    transform: scaleX(1);
    transition: transform ${HOLD_TO_CANCEL.holdMs}ms linear;
  }

  button:disabled > & {
    opacity: 0;
  }
`;

export const Label = styled.span`
  position: relative;
`;

export const Hint = styled.div`
  margin-top: 6px;
  font-size: 11px;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

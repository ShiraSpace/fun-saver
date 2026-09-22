import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { ACCOUNT_PICKER_STYLE } from './constants';

const surface = ({ theme }: { theme: Theme }): string => theme.colors.surface;

const strongText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textStrong;

const mutedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;

const triggerBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.softBorder;

const nameSize = ({ theme }: { theme: Theme }): number => theme.typography.body;

const subSize = ({ theme }: { theme: Theme }): number => theme.typography.label;

export const Picker = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${ACCOUNT_PICKER_STYLE.listGap}px;
`;

export const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${ACCOUNT_PICKER_STYLE.gap}px;
  width: 100%;
  box-sizing: border-box;
  padding: ${ACCOUNT_PICKER_STYLE.paddingY}px ${ACCOUNT_PICKER_STYLE.paddingX}px;
  border: ${ACCOUNT_PICKER_STYLE.borderWidth}px solid ${triggerBorder};
  border-radius: ${ACCOUNT_PICKER_STYLE.radius}px;
  background: ${surface};
  color: ${strongText};
  font: inherit;
  text-align: start;
  cursor: pointer;
  transition: transform ${ACCOUNT_PICKER_STYLE.pressMs}ms ease;

  &:active {
    transform: scale(${ACCOUNT_PICKER_STYLE.pressScale});
  }
`;

export const Naming = styled.span`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${ACCOUNT_PICKER_STYLE.subGap}px;
`;

export const Name = styled.b`
  font-size: ${nameSize}px;
  font-weight: 700;
`;

export const Current = styled.span`
  display: flex;
  font-size: ${subSize}px;
  color: ${mutedText};
`;

export const Caret = styled.span`
  font-size: ${subSize}px;
  color: ${mutedText};
`;

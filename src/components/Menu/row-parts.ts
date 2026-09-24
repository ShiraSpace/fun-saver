import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { MENU_ROW_STYLE } from './constants';

const surface = ({ theme }: { theme: Theme }): string => theme.colors.surface;

const strongText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textStrong;

const mutedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;

const divider = ({ theme }: { theme: Theme }): string => theme.colors.divider;

const scopeBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.accountScopeBorder;

const selectedFill = ({ theme }: { theme: Theme }): string =>
  theme.colors.accountScopeBg;

const rowSize = ({ theme }: { theme: Theme }): number => theme.typography.body;

const row = `
  display: flex;
  align-items: center;
  gap: ${MENU_ROW_STYLE.gap}px;
  width: 100%;
  box-sizing: border-box;
  padding: ${MENU_ROW_STYLE.paddingY}px ${MENU_ROW_STYLE.paddingX}px;
  border-radius: ${MENU_ROW_STYLE.radius}px;
  text-align: start;
  cursor: pointer;
  transition: transform ${MENU_ROW_STYLE.pressMs}ms ease;

  &:active {
    transform: scale(${MENU_ROW_STYLE.pressScale});
  }
`;

export const Row = styled.button`
  ${row}
  border: ${MENU_ROW_STYLE.borderWidth}px solid transparent;
  background: ${surface};
  color: ${strongText};
  font: inherit;
  font-size: ${rowSize}px;
  font-weight: 600;

  &[aria-current='true'] {
    border-color: ${scopeBorder};
    background: ${selectedFill};
  }
`;

export const AddButton = styled.button`
  ${row}
  justify-content: center;
  border: ${MENU_ROW_STYLE.borderWidth}px dashed ${divider};
  background: transparent;
  color: ${mutedText};
  font: inherit;
  font-size: ${rowSize}px;
  font-weight: 600;
`;

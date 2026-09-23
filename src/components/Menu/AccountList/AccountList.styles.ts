import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { ACCOUNT_LIST_STYLE } from './constants';
import { MENU_ROW_STYLE } from '../constants';

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

const deepShadow = ({ theme }: { theme: Theme }): string => theme.shadows.deep;

const rowSize = ({ theme }: { theme: Theme }): number => theme.typography.body;

const totalSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.label;

export const List = styled.div`
  position: absolute;
  inset-inline: 0;
  top: calc(100% + ${ACCOUNT_LIST_STYLE.popoverOffset}px);
  display: flex;
  flex-direction: column;
  gap: ${ACCOUNT_LIST_STYLE.gap}px;
  box-sizing: border-box;
  padding: ${ACCOUNT_LIST_STYLE.popoverPadding}px;
  border: ${MENU_ROW_STYLE.borderWidth}px solid ${scopeBorder};
  border-radius: ${ACCOUNT_LIST_STYLE.popoverRadius}px;
  background: ${surface};
  box-shadow: 0 14px 30px ${deepShadow};
`;

const row = `
  display: flex;
  align-items: center;
  gap: ${ACCOUNT_LIST_STYLE.rowGap}px;
  width: 100%;
  box-sizing: border-box;
  padding: ${ACCOUNT_LIST_STYLE.rowPaddingY}px ${ACCOUNT_LIST_STYLE.rowPaddingX}px;
  border-radius: ${ACCOUNT_LIST_STYLE.rowRadius}px;
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

export const AddRow = styled.button`
  ${row}
  justify-content: center;
  border: ${MENU_ROW_STYLE.borderWidth}px dashed ${divider};
  background: transparent;
  color: ${mutedText};
  font: inherit;
  font-size: ${rowSize}px;
  font-weight: 600;
`;

export const Name = styled.span`
  min-width: ${ACCOUNT_LIST_STYLE.nameColumnWidth}px;
`;

export const Total = styled.span`
  font-size: ${totalSize}px;
  font-weight: 700;
  color: ${mutedText};
`;

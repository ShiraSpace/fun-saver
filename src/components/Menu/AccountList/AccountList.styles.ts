import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { ACCOUNT_LIST_STYLE } from './constants';
import { MENU_ROW_STYLE } from '../constants';

const surface = ({ theme }: { theme: Theme }): string => theme.colors.surface;

const strongText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textStrong;

const mutedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;

const selectedFill = ({ theme }: { theme: Theme }): string =>
  theme.colors.accountScopeBg;

const rowSize = ({ theme }: { theme: Theme }): number => theme.typography.body;

const scopeBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.accountScopeBorder;

const deepShadow = ({ theme }: { theme: Theme }): string => theme.shadows.deep;

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

export const Name = styled.span`
  min-width: ${ACCOUNT_LIST_STYLE.nameColumnWidth}px;
`;

export const Total = styled.span`
  font-size: ${totalSize}px;
  font-weight: 700;
  color: ${mutedText};
`;

export const ColumnLabels = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2px 6px 4px;
  font-size: ${totalSize}px;
  color: ${mutedText};
`;

export const ListedAccount = styled.div`
  display: flex;
  align-items: center;
  gap: ${MENU_ROW_STYLE.gap}px;
  padding: ${MENU_ROW_STYLE.paddingY}px ${MENU_ROW_STYLE.paddingX}px;
  border: ${MENU_ROW_STYLE.borderWidth}px solid transparent;
  border-radius: ${MENU_ROW_STYLE.radius}px;
  background: ${surface};

  &[data-current='true'] {
    border-color: ${scopeBorder};
    background: ${selectedFill};
  }
`;

export const PickButton = styled.button`
  display: flex;
  flex: 1;
  align-items: center;
  gap: ${MENU_ROW_STYLE.gap}px;
  padding: 0;
  border: none;
  background: none;
  color: ${strongText};
  font: inherit;
  font-size: ${rowSize}px;
  font-weight: 600;
  text-align: start;
  cursor: pointer;
  transition: transform ${MENU_ROW_STYLE.pressMs}ms ease;

  &:active {
    transform: scale(${MENU_ROW_STYLE.pressScale});
  }
`;

export const ToggleButton = styled.button`
  display: flex;
  padding: 8px 0;
  border: none;
  background: none;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { ACCOUNT_LIST_STYLE } from './constants';
import { MENU_ROW_STYLE } from '../constants';

const surface = ({ theme }: { theme: Theme }): string => theme.colors.surface;

const mutedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;

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

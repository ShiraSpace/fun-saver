import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { ACCOUNTS_SECTION_STYLE } from './constants';

const chipFill = ({ theme }: { theme: Theme }): string => theme.colors.surface;

const chipBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.divider;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${ACCOUNTS_SECTION_STYLE.rowGap}px;
  flex-wrap: wrap;
`;

export const ActionChip = styled.button`
  width: ${ACCOUNTS_SECTION_STYLE.avatarSize}px;
  height: ${ACCOUNTS_SECTION_STYLE.avatarSize}px;
  border: 1px solid ${chipBorder};
  border-radius: 50%;
  background: ${chipFill};
  color: currentColor;
  font-size: ${ACCOUNTS_SECTION_STYLE.actionFontSize}px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
`;

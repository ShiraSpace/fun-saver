import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { ScopeBlock } from '../scope-parts';
import { MENU_ROW_STYLE } from '../constants';

const scopeBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.accountScopeBorder;

const stripe = ({ theme }: { theme: Theme }): string => theme.colors.softBorder;

const mutedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;

const headingSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.body;

const noteSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.label;

export const AccountBlock = styled(ScopeBlock)`
  border: ${MENU_ROW_STYLE.borderWidth}px dashed ${scopeBorder};
  background: transparent;
  box-shadow: inset 4px 0 0 ${stripe};
`;

export const Head = styled.h2`
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 3px;
  font-size: ${headingSize}px;
  font-weight: 700;
`;

export const Note = styled.p`
  margin: 0 0 10px;
  text-align: start;
  font-size: ${noteSize}px;
  line-height: 1.5;
  color: ${mutedText};
`;

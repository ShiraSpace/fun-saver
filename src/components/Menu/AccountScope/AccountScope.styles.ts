import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { ScopeBlock } from '../scope-parts';
import { MENU_ROW_STYLE } from '../constants';
import { ACCOUNT_SCOPE_STYLE } from './constants';

const divider = ({ theme }: { theme: Theme }): string => theme.colors.divider;

const stripe = ({ theme }: { theme: Theme }): string => theme.colors.softBorder;

const mutedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;

const headingSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.body;

const noteSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.label;

export const AccountBlock = styled(ScopeBlock)`
  border: ${MENU_ROW_STYLE.borderWidth}px dashed ${divider};
  background: transparent;
  box-shadow: inset ${ACCOUNT_SCOPE_STYLE.stripeWidth}px 0 0 ${stripe};
`;

export const Head = styled.h2`
  display: flex;
  align-items: center;
  gap: ${ACCOUNT_SCOPE_STYLE.headGap}px;
  margin: 0 0 ${ACCOUNT_SCOPE_STYLE.headMarginBottom}px;
  font-size: ${headingSize}px;
  font-weight: 700;
`;

export const Note = styled.p`
  margin: 0 0 ${ACCOUNT_SCOPE_STYLE.noteMarginBottom}px;
  text-align: start;
  font-size: ${noteSize}px;
  line-height: ${ACCOUNT_SCOPE_STYLE.noteLineHeight};
  color: ${mutedText};
`;

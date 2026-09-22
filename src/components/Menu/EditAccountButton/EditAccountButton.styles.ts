import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { EDIT_ACCOUNT_BUTTON_STYLE } from './constants';

const mutedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;

const underlineColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.accountScopeBorder;

const labelSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.label;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${EDIT_ACCOUNT_BUTTON_STYLE.gap}px;
  width: 100%;
  box-sizing: border-box;
  margin-top: ${EDIT_ACCOUNT_BUTTON_STYLE.marginTop}px;
  padding: ${EDIT_ACCOUNT_BUTTON_STYLE.paddingY}px
    ${EDIT_ACCOUNT_BUTTON_STYLE.paddingX}px;
  border: none;
  background: transparent;
  color: ${mutedText};
  font: inherit;
  font-size: ${labelSize}px;
  font-weight: 600;
  cursor: pointer;
`;

export const EditLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-decoration: underline;
  text-underline-offset: ${EDIT_ACCOUNT_BUTTON_STYLE.underlineOffset}px;
  text-decoration-color: ${underlineColor};
`;

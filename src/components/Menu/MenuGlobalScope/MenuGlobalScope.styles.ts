import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { ScopeBlock } from '../scope-parts';
import { MENU_ROW_STYLE } from '../constants';

const scopeFill = ({ theme }: { theme: Theme }): string =>
  theme.colors.accountScopeBg;

const scopeBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.accountScopeBorder;

export const GlobalBlock = styled(ScopeBlock)`
  position: relative;
  z-index: 1;
  border: ${MENU_ROW_STYLE.borderWidth}px solid ${scopeBorder};
  background: ${scopeFill};
`;

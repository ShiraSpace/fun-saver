import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { SettingsBlock } from '../settings-parts';
import { MENU_ROW_STYLE } from '../constants';

const scopeFill = ({ theme }: { theme: Theme }): string =>
  theme.colors.accountScopeBg;

const scopeBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.accountScopeBorder;

export const UserSettingsBlock = styled(SettingsBlock)`
  position: relative;
  z-index: 1;
  border: ${MENU_ROW_STYLE.borderWidth}px solid ${scopeBorder};
  background: ${scopeFill};
`;

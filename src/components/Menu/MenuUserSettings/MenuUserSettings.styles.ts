import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { SettingsBlock } from '../settings-parts';
import { MENU_ROW_STYLE } from '../constants';

const settingsFill = ({ theme }: { theme: Theme }): string =>
  theme.colors.settingsBg;

const settingsBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.settingsBorder;

export const UserSettingsBlock = styled(SettingsBlock)`
  position: relative;
  z-index: 1;
  border: ${MENU_ROW_STYLE.borderWidth}px solid ${settingsBorder};
  background: ${settingsFill};
`;

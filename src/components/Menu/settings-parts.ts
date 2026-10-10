import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { MENU_LAYOUT, MENU_ROW_STYLE } from './constants';

const sectionBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.settingsBorder;

const stripe = ({ theme }: { theme: Theme }): string => theme.colors.softBorder;

const mutedText = ({ theme }: { theme: Theme }): string =>
  theme.colors.textMuted;

const headingSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.body;

const noteSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.label;

export const SettingsBlock = styled.div`
  box-sizing: border-box;
  margin-bottom: ${MENU_LAYOUT.blockGap}px;
  padding: 12px;
  border-radius: 20px;
`;

export const SettingsSection = styled(SettingsBlock)`
  border: ${MENU_ROW_STYLE.borderWidth}px dashed ${sectionBorder};
  background: transparent;
  box-shadow: inset 4px 0 0 ${stripe};
`;

export const SettingsHeading = styled.h2`
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 3px;
  font-size: ${headingSize}px;
  font-weight: 700;
`;

export const SettingsNote = styled.p`
  margin: 0 0 10px;
  text-align: start;
  font-size: ${noteSize}px;
  line-height: 1.5;
  color: ${mutedText};
`;

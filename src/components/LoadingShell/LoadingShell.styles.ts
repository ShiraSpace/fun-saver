import styled from '@emotion/styled';
import { SCREEN_LAYOUT } from '@/components/Screen/constants';
import {
  HEADER_AVATAR_PROPS,
  HEADER_LAYOUT,
} from '@/components/Header/constants';
import { MENU_ICON } from '@/components/Menu/constants';
import { themeVar } from '@/theme/theme-at-first-paint';

export const Surface = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${SCREEN_LAYOUT.gap}px;
  min-height: 100vh;
  background: ${themeVar('gradients', 'screen')};
`;

export const Card = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: ${HEADER_LAYOUT.gap}px;
  width: 100%;
  min-height: ${HEADER_LAYOUT.height}px;
  padding: ${HEADER_LAYOUT.paddingY}px ${HEADER_LAYOUT.paddingX}px;
  box-sizing: border-box;
  background: ${themeVar('colors', 'surface')};
  border-radius: ${HEADER_LAYOUT.radius}px;
  box-shadow: 0 4px 0 ${themeVar('shadows', 'faint')};
`;

export const BurgerSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: ${MENU_ICON.buttonSize}px;
  height: ${MENU_ICON.buttonSize}px;
  color: ${themeVar('colors', 'textStrong')};
`;

export const GhostTitle = styled.span`
  flex: 1;
  height: 18px;
  border-radius: 7px;
  background: ${themeVar('colors', 'walletTrack')};
`;

export const GhostAvatar = styled.span`
  flex: none;
  width: ${HEADER_AVATAR_PROPS.size}px;
  height: ${HEADER_AVATAR_PROPS.size}px;
  border-radius: 50%;
  background: ${themeVar('colors', 'walletTrack')};
`;

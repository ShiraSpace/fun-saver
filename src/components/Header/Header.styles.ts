import styled from '@emotion/styled';
import Link from 'next/link';
import { AvatarBadge } from '../AvatarBadge';
import { HEADER_AVATAR_PROPS, HEADER_LAYOUT } from './constants';

export const Bar = styled.header`
  position: relative;
  z-index: ${HEADER_LAYOUT.foregroundZIndex};
  display: flex;
  align-items: center;
  gap: ${HEADER_LAYOUT.gap}px;
  width: 100%;
  padding: ${HEADER_LAYOUT.paddingY}px ${HEADER_LAYOUT.paddingX}px;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: ${HEADER_LAYOUT.radius}px;
  box-shadow: ${HEADER_LAYOUT.shadow};
  color: ${({ theme }): string => theme.colors.textStrong};
  min-height: ${HEADER_LAYOUT.height}px;
  box-sizing: border-box;
`;

export const HomeLink = styled(Link)`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: ${HEADER_AVATAR_PROPS.size}px;
  height: ${HEADER_AVATAR_PROPS.size}px;
  border-radius: 50%;
  background: ${({ theme }): string => theme.colors.accountScopeBg};
  font-size: 20px;
  line-height: 1;
  text-decoration: none;
`;

export const HeaderAvatar = styled(AvatarBadge)<{ isHidden: boolean }>`
  z-index: ${HEADER_LAYOUT.foregroundZIndex};
  opacity: ${({ isHidden }): number => (isHidden ? 0 : 1)};
  visibility: ${({ isHidden }): string => (isHidden ? 'hidden' : 'visible')};
  transition:
    opacity ${HEADER_LAYOUT.transitionMs}ms ease,
    visibility ${HEADER_LAYOUT.transitionMs}ms ease;
`;

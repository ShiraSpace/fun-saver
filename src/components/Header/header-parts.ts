import styled from '@emotion/styled';
import { AvatarBadge } from '../AvatarBadge';
import { HEADER_LAYOUT } from './constants';

export const HeaderAvatar = styled(AvatarBadge)<{ isHidden: boolean }>`
  opacity: ${({ isHidden }): number => (isHidden ? 0 : 1)};
  visibility: ${({ isHidden }): string => (isHidden ? 'hidden' : 'visible')};
  transition:
    opacity ${HEADER_LAYOUT.transitionMs}ms ease,
    visibility ${HEADER_LAYOUT.transitionMs}ms ease;
`;

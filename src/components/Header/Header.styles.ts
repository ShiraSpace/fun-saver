import styled from '@emotion/styled';
import { AvatarBadge } from '../AvatarBadge';
import { HEADER_LAYOUT } from './constants';

export const Bar = styled.header`
  display: flex;
  align-items: center;
  gap: ${HEADER_LAYOUT.gap}px;
  width: 100%;
  padding: ${HEADER_LAYOUT.paddingY}px ${HEADER_LAYOUT.paddingX}px;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: ${HEADER_LAYOUT.radius}px;
  box-shadow: ${HEADER_LAYOUT.shadow};
  color: ${({ theme }): string => theme.colors.textStrong};
  transition:
    background ${HEADER_LAYOUT.transitionMs}ms ease,
    box-shadow ${HEADER_LAYOUT.transitionMs}ms ease;

  &[data-open='true'] {
    background: transparent;
    box-shadow: none;
  }
`;

export const HeaderAvatar = styled(AvatarBadge)`
  z-index: ${HEADER_LAYOUT.foregroundZIndex};
`;

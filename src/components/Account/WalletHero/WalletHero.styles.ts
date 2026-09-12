import styled from '@emotion/styled';
import { Star } from './Star/Star';
import { HERO_STYLE } from './constants';

export const Card = styled.div`
  position: relative;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: ${HERO_STYLE.radius}px;
  padding: ${HERO_STYLE.padding}px;
  box-shadow: ${HERO_STYLE.shadow};
  color: ${({ theme }): string => theme.colors.textStrong};
`;

export const CornerStar = styled(Star)`
  position: absolute;
  top: ${HERO_STYLE.cornerStarTop}px;
  right: ${HERO_STYLE.cornerStarRight}px;
  width: ${HERO_STYLE.cornerStarSize}px;
  height: ${HERO_STYLE.cornerStarSize}px;
  transform: rotate(${HERO_STYLE.cornerStarRotation}deg);
  pointer-events: none;
`;

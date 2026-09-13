import styled from '@emotion/styled';
import { DONUT_STYLE } from '../constants';

export const Svg = styled.svg`
  display: block;
  transform: rotate(${DONUT_STYLE.rotation}deg);

  circle {
    fill: none;
    stroke-linecap: butt;
    stroke-width: ${DONUT_STYLE.strokeWidth};
  }
`;

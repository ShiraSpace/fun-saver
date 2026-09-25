import styled from '@emotion/styled';

export const Line = styled.path`
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2.25;

  &[data-total-balance='true'] {
    stroke-width: 3.25;
  }
`;

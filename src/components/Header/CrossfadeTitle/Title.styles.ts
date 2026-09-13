import styled from '@emotion/styled';
import { keyframes, type Theme } from '@emotion/react';
import { HEADER_LAYOUT } from '../constants';

const titleSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.title;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Text = styled.span`
  position: relative;
  z-index: ${HEADER_LAYOUT.foregroundZIndex};
  flex: 1;
  text-align: start;
  font-size: ${titleSize}px;
  font-weight: ${HEADER_LAYOUT.nameWeight};
  color: inherit;
  animation: ${fadeIn} ${HEADER_LAYOUT.transitionMs}ms ease;
`;

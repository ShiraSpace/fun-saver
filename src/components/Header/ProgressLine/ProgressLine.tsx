'use client';

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { HEADER_LAYOUT } from '../constants';
import { themeVar } from '@/theme/theme-at-first-paint';

const sweep = keyframes`
  from {
    transform: translateX(120%);
  }
  to {
    transform: translateX(-240%);
  }
`;

export const ProgressLine = styled.span`
  position: absolute;
  inset-inline: ${HEADER_LAYOUT.radius}px;
  bottom: 0;
  height: 3px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset-block: 0;
    width: 42%;
    background: ${themeVar('colors', 'primary')};
    animation: ${sweep} 900ms ease-in-out 150ms infinite backwards;
  }
`;

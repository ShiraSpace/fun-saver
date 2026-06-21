'use client';

import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { SCREEN_LAYOUT } from './constants';

const surface = ({ theme }: { theme: Theme }): string => theme.gradients.screen;

export const Screen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${SCREEN_LAYOUT.gap}px;
  min-height: 100vh;
  text-align: center;
  background: ${surface};
`;

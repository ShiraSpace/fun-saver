'use client';

import styled from '@emotion/styled';
import { GRADIENTS } from '@/theme/gradients';
import { SCREEN_LAYOUT } from './constants';

export const Screen = styled.div<{ align?: 'center' | 'top' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ align }) =>
    align === 'top' ? 'flex-start' : 'center'};
  gap: ${SCREEN_LAYOUT.gap}px;
  min-height: 100vh;
  text-align: center;
  background: ${GRADIENTS.screen};
`;

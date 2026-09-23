'use client';

import styled from '@emotion/styled';
import { SCREEN_LAYOUT } from './constants';

export const Column = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: ${SCREEN_LAYOUT.maxWidth}px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: ${SCREEN_LAYOUT.paddingY}px ${SCREEN_LAYOUT.paddingX}px;
`;

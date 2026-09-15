'use client';

import styled from '@emotion/styled';
import { PIG_SIZE } from './constants';

interface PigProps {
  size?: number;
}

export const Pig = styled.span<PigProps>`
  font-size: ${({ size }): number => size ?? PIG_SIZE.default}px;
  line-height: 1;
  display: inline-block;
`;

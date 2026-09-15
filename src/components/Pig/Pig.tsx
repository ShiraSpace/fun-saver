'use client';

import styled from '@emotion/styled';
import { PIG_SIZE } from './constants';

export const Pig = styled.span<{ pigSize?: number }>`
  font-size: ${({ pigSize }): number => pigSize ?? PIG_SIZE.default}px;
  line-height: 1;
  display: inline-block;
`;

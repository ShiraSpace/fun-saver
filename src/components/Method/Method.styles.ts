import styled from '@emotion/styled';
import { METHOD_LAYOUT } from './constants';

export const Column = styled.div`
  width: 100%;
  max-width: ${METHOD_LAYOUT.maxWidth}px;
  display: flex;
  flex-direction: column;
  gap: ${METHOD_LAYOUT.gap}px;
  padding: ${METHOD_LAYOUT.paddingY}px ${METHOD_LAYOUT.paddingX}px;
`;

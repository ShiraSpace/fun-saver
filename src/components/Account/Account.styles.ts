import styled from '@emotion/styled';
import { ACCOUNT_LAYOUT } from './constants';
import { SCREEN_LAYOUT } from '@/components/Screen/constants';

export const Column = styled.div`
  width: 100%;
  max-width: ${ACCOUNT_LAYOUT.maxWidth}px;
  display: flex;
  flex-direction: column;
  gap: ${ACCOUNT_LAYOUT.gap}px;
  padding: ${SCREEN_LAYOUT.paddingY}px ${ACCOUNT_LAYOUT.paddingX}px;
  overflow: hidden;
`;

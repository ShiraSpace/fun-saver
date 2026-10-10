import styled from '@emotion/styled';
import { TRANSACTION_DRAWER_STYLE } from '../constants';

export const Handle = styled.div`
  width: 44px;
  height: 8px;
  flex-shrink: 0;
  padding-bottom: ${TRANSACTION_DRAWER_STYLE.handlePaddingBottom}px;
  border-radius: 999px;
  background: ${({ theme }): string => theme.colors.divider};
  margin: 2px auto;
  cursor: grab;
  touch-action: none;
  &:active {
    cursor: grabbing;
  }
`;

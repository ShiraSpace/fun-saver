import styled from '@emotion/styled';
import { HEADER_LAYOUT } from './constants';

export const Bar = styled.header`
  position: relative;
  z-index: ${HEADER_LAYOUT.foregroundZIndex};
  display: flex;
  align-items: center;
  gap: ${HEADER_LAYOUT.gap}px;
  width: 100%;
  padding: ${HEADER_LAYOUT.paddingY}px ${HEADER_LAYOUT.paddingX}px;
  background: ${({ theme }): string => theme.colors.surface};
  border-radius: ${HEADER_LAYOUT.radius}px;
  box-shadow: ${HEADER_LAYOUT.shadow};
  color: ${({ theme }): string => theme.colors.textStrong};
  min-height: ${HEADER_LAYOUT.height}px;
  box-sizing: border-box;
`;

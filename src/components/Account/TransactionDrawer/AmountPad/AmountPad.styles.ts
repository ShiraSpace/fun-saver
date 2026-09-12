import styled from '@emotion/styled';
import { AMOUNT_PAD_STYLE } from './constants';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${AMOUNT_PAD_STYLE.gap}px;
  margin-bottom: ${AMOUNT_PAD_STYLE.gridMarginBottom}px;
`;

export const Key = styled.button`
  border: none;
  border-radius: ${AMOUNT_PAD_STYLE.radius}px;
  background: ${({ theme }): string => theme.colors.surface};
  color: ${({ theme }): string => theme.colors.textStrong};
  font-family: inherit;
  font-size: ${({ theme }): number => theme.typography.title}px;
  font-weight: 600;
  padding: ${AMOUNT_PAD_STYLE.keyPaddingY}px 0;
  cursor: pointer;
  box-shadow: ${AMOUNT_PAD_STYLE.shadow};
  transition:
    transform ${AMOUNT_PAD_STYLE.pressMs}ms ease,
    box-shadow ${AMOUNT_PAD_STYLE.pressMs}ms ease;

  &:active {
    transform: translateY(${AMOUNT_PAD_STYLE.pressDrop}px);
    box-shadow: none;
  }
`;

export const ZeroKey = styled(Key)`
  grid-column: 1 / -1;
`;

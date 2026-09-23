import styled from '@emotion/styled';
import { AMOUNT_PAD_STYLE } from '../constants';

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${AMOUNT_PAD_STYLE.gap}px;
  margin-top: ${AMOUNT_PAD_STYLE.topGap}px;
  margin-bottom: ${AMOUNT_PAD_STYLE.gap}px;
`;

export const EditKey = styled.button`
  border: none;
  border-radius: ${AMOUNT_PAD_STYLE.radius}px;
  background: ${({ theme }): string => theme.colors.surface};
  color: ${({ theme }): string => theme.colors.textMuted};
  font-family: inherit;
  font-size: ${({ theme }): number => theme.typography.heading}px;
  font-weight: 600;
  padding: ${AMOUNT_PAD_STYLE.editPaddingY}px 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 3px 0 ${({ theme }): string => theme.shadows.faint};
  transition:
    transform ${AMOUNT_PAD_STYLE.pressMs}ms ease,
    box-shadow ${AMOUNT_PAD_STYLE.pressMs}ms ease;

  &:active {
    transform: translateY(${AMOUNT_PAD_STYLE.pressDrop}px);
    box-shadow: none;
  }
`;

export const EditIcon = styled.span`
  font-size: ${({ theme }): number => theme.typography.title}px;
`;

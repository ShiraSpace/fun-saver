import styled from '@emotion/styled';
import { MENU_ROW_STYLE } from '../constants';

export const GoalRow = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 10px;
  padding: 10px 12px;
  border: ${MENU_ROW_STYLE.borderWidth}px solid
    ${({ theme }): string => theme.colors.softBorder};
  border-radius: 18px;
  background: ${({ theme }): string => theme.colors.surface};
  color: ${({ theme }): string => theme.colors.textStrong};
  font: inherit;
  text-align: start;
  cursor: pointer;
  transition: transform ${MENU_ROW_STYLE.pressMs}ms ease;

  &:active {
    transform: scale(${MENU_ROW_STYLE.pressScale});
  }
`;

export const Thumb = styled.span`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 24px;
  background: ${({ theme }): string => theme.gradients.walletSavings};
`;

export const Body = styled.span`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Top = styled.span`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }): number => theme.typography.body - 1}px;
  font-weight: 700;
`;

export const Chevron = styled.span`
  font-size: ${({ theme }): number => theme.typography.body}px;
  color: ${({ theme }): string => theme.colors.textMuted};
`;

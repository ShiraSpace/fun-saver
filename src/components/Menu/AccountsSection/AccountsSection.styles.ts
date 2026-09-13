import styled from '@emotion/styled';
import { ACCOUNTS_SECTION_STYLE } from './constants';

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${ACCOUNTS_SECTION_STYLE.rowGap}px;
  flex-wrap: wrap;
`;

export const ActionChip = styled.button`
  width: ${ACCOUNTS_SECTION_STYLE.avatarSize}px;
  height: ${ACCOUNTS_SECTION_STYLE.avatarSize}px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  color: currentColor;
  font-size: ${ACCOUNTS_SECTION_STYLE.actionFontSize}px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
`;

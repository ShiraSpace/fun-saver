import styled from '@emotion/styled';
import type { Themed } from '@/theme/themed';

const strongText = ({ theme }: Themed): string => theme.colors.textStrong;
const mutedText = ({ theme }: Themed): string => theme.colors.textMuted;
const headingSize = ({ theme }: Themed): number => theme.typography.heading;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SheetTitle = styled.h2`
  margin: 0;
  font-size: ${headingSize}px;
  font-weight: 800;
  color: ${strongText};
`;

export const CloseButton = styled.button`
  padding: 4px;
  border: none;
  background: transparent;
  font-size: ${headingSize}px;
  color: ${mutedText};
  cursor: pointer;
`;

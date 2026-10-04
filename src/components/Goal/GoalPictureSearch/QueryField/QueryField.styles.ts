import styled from '@emotion/styled';
import type { Themed } from '@/theme/themed';

const searchFill = ({ theme }: Themed): string => theme.colors.walletTrack;
const strongText = ({ theme }: Themed): string => theme.colors.textStrong;

export const SearchBox = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 14px;
  outline: none;
  background: ${searchFill};
  font: inherit;
  font-weight: 700;
  color: ${strongText};
`;

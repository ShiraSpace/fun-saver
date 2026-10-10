import styled from '@emotion/styled';
import type { Themed } from '@/theme/themed';

const reasonColor = ({ theme }: Themed): string => theme.colors.textMuted;
const failedToLoadColor = ({ theme }: Themed): string => theme.colors.alertText;
const bodySize = ({ theme }: Themed): number => theme.typography.body;

export const FoundPictures = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-content: start;
  gap: 6px;
  aspect-ratio: 1;
  min-height: 0;
  padding: 4px;
  overflow-y: auto;
`;

export const NoPicturesReason = styled.p<{ failedToLoad: boolean }>`
  margin: 0;
  padding: 24px 8px;
  text-align: center;
  font-size: ${bodySize}px;
  font-weight: 600;
  color: ${(props): string =>
    props.failedToLoad ? failedToLoadColor(props) : reasonColor(props)};
`;

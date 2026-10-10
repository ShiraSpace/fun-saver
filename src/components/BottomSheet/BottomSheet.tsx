'use client';

import styled from '@emotion/styled';
import { SCREEN_LAYOUT } from '@/components/Screen/constants';
import type { Themed } from '@/theme/themed';

const shade = ({ theme }: Themed): string => theme.tints.shade;
const surface = ({ theme }: Themed): string => theme.colors.surface;
const deepShadow = ({ theme }: Themed): string => theme.shadows.deep;

export const BottomSheetScrim = styled.div`
  position: fixed;
  inset: 0;
  background: ${shade};
`;

export const BottomSheet = styled.div`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  width: 100%;
  max-width: ${SCREEN_LAYOUT.maxWidth}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: ${surface};
  border-radius: 28px 28px 0 0;
  box-shadow: 0 -10px 30px ${deepShadow};
`;

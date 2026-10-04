import styled from '@emotion/styled';
import { LAYERS } from '@/theme/layers';
import { SCREEN_LAYOUT } from '@/components/Screen/constants';
import type { Themed } from '@/theme/themed';

const shade = ({ theme }: Themed): string => theme.tints.shade;
const surface = ({ theme }: Themed): string => theme.colors.surface;
const deepShadow = ({ theme }: Themed): string => theme.shadows.deep;

export const Scrim = styled.div`
  position: fixed;
  inset: 0;
  background: ${shade};
  z-index: ${LAYERS.modalForeground};
`;

export const Sheet = styled.div`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: ${LAYERS.modalForeground};
  width: 100%;
  max-width: ${SCREEN_LAYOUT.maxWidth}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  max-height: 90dvh;
  gap: 12px;
  padding: 16px 14px 18px;
  background: ${surface};
  border-radius: 26px 26px 0 0;
  box-shadow: 0 -10px 30px ${deepShadow};
`;

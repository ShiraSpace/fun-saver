import styled from '@emotion/styled';
import { LAYERS } from '@/theme/layers';
import { BottomSheet, BottomSheetScrim } from '@/components/BottomSheet';

export const Scrim = styled(BottomSheetScrim)`
  z-index: ${LAYERS.modalOverModal};
`;

export const Sheet = styled(BottomSheet)`
  z-index: ${LAYERS.modalOverModalForeground};
  max-height: 90dvh;
  gap: 12px;
  padding: 16px 14px 18px;
  outline: none;
`;

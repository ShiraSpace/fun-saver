import styled from '@emotion/styled';
import { LAYERS } from '@/theme/layers';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${LAYERS.modal};
  overflow-y: auto;
`;

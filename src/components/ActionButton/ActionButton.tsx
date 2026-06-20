'use client';

import styled from '@emotion/styled';
import { COLORS } from '@/theme/palette';
import { TYPE_SCALE } from '@/theme/typography';
import { ACTION_BUTTON } from './constants';

export const ActionButton = styled.button`
  font-size: ${TYPE_SCALE.h3}px;
  font-weight: 700;
  padding: ${ACTION_BUTTON.paddingY}px ${ACTION_BUTTON.paddingX}px;
  border: none;
  border-radius: ${ACTION_BUTTON.radius}px;
  background: ${COLORS.primary};
  color: ${COLORS.textOnPrimary};
  cursor: pointer;
  box-shadow: 0 4px 0 ${COLORS.primaryShadow};
`;

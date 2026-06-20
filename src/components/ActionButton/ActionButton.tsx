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
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 ${ACTION_BUTTON.shadowDepth}px 0 ${COLORS.primaryShadow};
  transition:
    transform ${ACTION_BUTTON.transitionMs}ms ease,
    box-shadow ${ACTION_BUTTON.transitionMs}ms ease;

  &:hover {
    transform: translateY(-${ACTION_BUTTON.hoverLift}px);
    box-shadow: 0 ${ACTION_BUTTON.shadowDepth + ACTION_BUTTON.hoverLift}px 0
      ${COLORS.primaryShadow};
  }

  &:active {
    transform: translateY(${ACTION_BUTTON.pressDrop}px);
    box-shadow: 0 0 0 ${COLORS.primaryShadow};
  }
`;

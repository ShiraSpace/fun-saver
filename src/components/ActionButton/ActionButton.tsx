'use client';

import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { TYPE_SCALE } from '@/theme/typography';
import { ACTION_BUTTON } from './constants';

interface Themed {
  theme: Theme;
}

const fill = ({ theme }: Themed): string => theme.gradients.actionButton;
const label = ({ theme }: Themed): string => theme.colors.textOnPrimary;
const shadow = ({ theme }: Themed): string => theme.colors.primaryShadow;
const glow = ({ theme }: Themed): string => theme.colors.primaryGlow;

export const ActionButton = styled.button`
  font-size: ${TYPE_SCALE.h3}px;
  font-weight: 700;
  padding: ${ACTION_BUTTON.paddingY}px ${ACTION_BUTTON.paddingX}px;
  border: none;
  border-radius: ${ACTION_BUTTON.radius}px;
  background: ${fill};
  color: ${label};
  text-decoration: none;
  cursor: pointer;
  box-shadow:
    0 ${ACTION_BUTTON.shadowDepth}px 0 ${shadow},
    0 ${ACTION_BUTTON.glowOffsetY}px ${ACTION_BUTTON.glowBlur}px ${glow};
  transition:
    transform ${ACTION_BUTTON.transitionMs}ms ease,
    box-shadow ${ACTION_BUTTON.transitionMs}ms ease;

  &:hover {
    transform: translateY(-${ACTION_BUTTON.hoverLift}px);
    box-shadow:
      0 ${ACTION_BUTTON.shadowDepth + ACTION_BUTTON.hoverLift}px 0 ${shadow},
      0 ${ACTION_BUTTON.glowOffsetY + ACTION_BUTTON.hoverLift}px
        ${ACTION_BUTTON.glowBlur}px ${glow};
  }

  &:active {
    transform: translateY(${ACTION_BUTTON.pressDrop}px);
    box-shadow:
      0 0 0 ${shadow},
      0 0 0 ${glow};
  }
`;

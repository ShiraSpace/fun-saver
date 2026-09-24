'use client';

import styled from '@emotion/styled';
import { TYPE_SCALE } from '@/theme/typography';
import type { Themed } from '@/theme/themed';
import { PRIMARY_BUTTON } from './constants';

const fill = ({ theme }: Themed): string => theme.gradients.primaryButton;
const label = ({ theme }: Themed): string => theme.colors.textOnPrimary;
const shadow = ({ theme }: Themed): string => theme.colors.primaryShadow;
const glow = ({ theme }: Themed): string => theme.colors.primaryGlow;

export const PrimaryButton = styled.button`
  font-size: ${TYPE_SCALE.heading}px;
  font-weight: 700;
  padding: ${PRIMARY_BUTTON.paddingY}px ${PRIMARY_BUTTON.paddingX}px;
  border: none;
  border-radius: ${PRIMARY_BUTTON.radius}px;
  background: ${fill};
  color: ${label};
  text-decoration: none;
  cursor: pointer;
  box-shadow:
    0 ${PRIMARY_BUTTON.shadowDepth}px 0 ${shadow},
    0 ${PRIMARY_BUTTON.glowOffsetY}px ${PRIMARY_BUTTON.glowBlur}px ${glow};
  transition:
    transform ${PRIMARY_BUTTON.transitionMs}ms ease,
    box-shadow ${PRIMARY_BUTTON.transitionMs}ms ease;

  &:hover {
    transform: translateY(-${PRIMARY_BUTTON.hoverLift}px);
    box-shadow:
      0 ${PRIMARY_BUTTON.shadowDepth + PRIMARY_BUTTON.hoverLift}px 0 ${shadow},
      0 ${PRIMARY_BUTTON.glowOffsetY + PRIMARY_BUTTON.hoverLift}px
        ${PRIMARY_BUTTON.glowBlur}px ${glow};
  }

  &:active {
    transform: translateY(${PRIMARY_BUTTON.pressDrop}px);
    box-shadow:
      0 0 0 ${shadow},
      0 0 0 ${glow};
  }
`;

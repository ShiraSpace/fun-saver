'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { MENU_ICON } from '../constants';

const IconBox = styled.span`
  position: relative;
  width: ${MENU_ICON.iconSize}px;
  height: ${MENU_ICON.iconSize}px;
  transition: transform ${MENU_ICON.transitionMs}ms ease;

  & > span {
    position: absolute;
    left: 0;
    right: 0;
    height: ${MENU_ICON.barHeight}px;
    border-radius: ${MENU_ICON.barRadius}px;
    background: currentColor;
    transition:
      top ${MENU_ICON.transitionMs}ms ease,
      bottom ${MENU_ICON.transitionMs}ms ease,
      transform ${MENU_ICON.transitionMs}ms ease,
      opacity ${MENU_ICON.transitionMs}ms ease;
  }

  & > span:nth-of-type(1) {
    top: 20%;
  }
  & > span:nth-of-type(2) {
    top: 50%;
    transform: translateY(-50%);
  }
  & > span:nth-of-type(3) {
    bottom: 20%;
  }

  &[data-open='true'] {
    transform: rotate(${MENU_ICON.spinDegrees}deg);
  }
  &[data-open='true'] > span:nth-of-type(1) {
    top: 50%;
    transform: translateY(-50%) rotate(${MENU_ICON.crossAngle}deg);
  }
  &[data-open='true'] > span:nth-of-type(2) {
    opacity: 0;
  }
  &[data-open='true'] > span:nth-of-type(3) {
    bottom: 50%;
    transform: translateY(50%) rotate(-${MENU_ICON.crossAngle}deg);
  }
`;

export interface BurgerIconProps {
  isOpen: boolean;
  testId?: string;
}

export function BurgerIcon({ isOpen, testId }: BurgerIconProps): JSX.Element {
  return (
    <IconBox data-open={isOpen} data-testid={testId}>
      <span />
      <span />
      <span />
    </IconBox>
  );
}

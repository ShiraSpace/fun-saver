'use client';

import { JSX, useState } from 'react';
import styled from '@emotion/styled';
import { MENU_ICON, MENU_TEST_IDS } from './constants';

const ToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${MENU_ICON.buttonSize}px;
  height: ${MENU_ICON.buttonSize}px;
  padding: 0;
  border: none;
  background: transparent;
  color: currentColor;
  cursor: pointer;
`;

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

export function Menu(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ToggleButton
      type="button"
      aria-expanded={isOpen}
      data-testid={MENU_TEST_IDS.menuButton}
      onClick={(): void => setIsOpen((open) => !open)}
    >
      <IconBox data-open={isOpen} data-testid={MENU_TEST_IDS.menuIcon}>
        <span />
        <span />
        <span />
      </IconBox>
    </ToggleButton>
  );
}

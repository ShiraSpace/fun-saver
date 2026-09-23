import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { AVATAR_PICKER_LAYOUT, AVATAR_PICKER_STYLE } from './constants';

interface OptionButtonProps {
  background: string;
}

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${AVATAR_PICKER_LAYOUT.columns}, 1fr);
  gap: ${AVATAR_PICKER_LAYOUT.gap}px;
  width: 100%;
  max-width: ${AVATAR_PICKER_LAYOUT.maxWidth}px;
`;

const optionFill = ({ background }: OptionButtonProps): string => background;

const ringColor = ({ theme }: { theme: Theme }): string =>
  theme.colors.selectionRing;

const selectedBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;

export const OptionButton = styled.button<OptionButtonProps>`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  padding: 0;
  border: ${AVATAR_PICKER_STYLE.borderWidth}px solid transparent;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background: ${optionFill};
  box-shadow: ${AVATAR_PICKER_STYLE.baseShadow};
  transition: transform ${AVATAR_PICKER_STYLE.transitionMs}ms ease;

  &:hover {
    transform: translateY(-${AVATAR_PICKER_STYLE.hoverLift}px);
  }

  &[data-selected='true'] {
    border-color: ${selectedBorder};
    box-shadow:
      0 0 0 ${AVATAR_PICKER_STYLE.ringWidth}px ${ringColor},
      ${AVATAR_PICKER_STYLE.baseShadow};
  }
`;

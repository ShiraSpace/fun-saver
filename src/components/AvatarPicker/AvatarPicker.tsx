'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import { Avatar } from '../Avatar';
import { AVATARS, type AvatarOption } from '@/lib/avatars';
import {
  AVATAR_PICKER_LAYOUT,
  AVATAR_PICKER_STYLE,
  AVATAR_PICKER_TEST_IDS,
} from './constants';

export interface AvatarPickerProps {
  selectedId: string | null;
  onSelect: (avatarId: string) => void;
}

interface OptionProps {
  avatar: AvatarOption;
  isSelected: boolean;
  onSelect: (avatarId: string) => void;
}

interface OptionButtonProps {
  background: string;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${AVATAR_PICKER_LAYOUT.columns}, 1fr);
  gap: ${AVATAR_PICKER_LAYOUT.gap}px;
  width: 100%;
  max-width: ${AVATAR_PICKER_LAYOUT.maxWidth}px;
`;

const optionFill = ({ background }: OptionButtonProps): string => background;
const ringColor = ({ theme }: { theme: Theme }): string => theme.colors.primary;
const selectedBorder = ({ theme }: { theme: Theme }): string =>
  theme.colors.textOnPrimary;

const OptionButton = styled.button<OptionButtonProps>`
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

function AvatarOption({
  avatar,
  isSelected,
  onSelect,
}: OptionProps): JSX.Element {
  const select = (): void => onSelect(avatar.id);
  const imagesSizes = Math.ceil(
    AVATAR_PICKER_LAYOUT.maxWidth / AVATAR_PICKER_LAYOUT.columns
  );
  return (
    <OptionButton
      type="button"
      data-testid={AVATAR_PICKER_TEST_IDS.option}
      data-selected={isSelected}
      background={avatar.background}
      onClick={select}
    >
      <Avatar
        avatarId={avatar.id}
        alt={avatar.id}
        fill
        sizes={`${imagesSizes}px`}
      />
    </OptionButton>
  );
}

export function AvatarPicker({
  selectedId,
  onSelect,
}: AvatarPickerProps): JSX.Element {
  const avatars = AVATARS.map((avatar) => (
    <AvatarOption
      key={avatar.id}
      avatar={avatar}
      isSelected={avatar.id === selectedId}
      onSelect={onSelect}
    />
  ));

  return <Grid data-testid={AVATAR_PICKER_TEST_IDS.container}>{avatars}</Grid>;
}

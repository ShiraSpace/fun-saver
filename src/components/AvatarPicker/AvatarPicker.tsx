'use client';

import { JSX } from 'react';
import { Avatar } from '../Avatar';
import { AVATARS, type AvatarOption } from '@/lib/account/avatars';
import { AVATAR_PICKER_LAYOUT, AVATAR_PICKER_TEST_IDS } from './constants';
import { Grid, OptionButton } from './AvatarPicker.styles';

export interface AvatarPickerProps {
  selectedId: string | null;
  onSelect: (avatarId: string) => void;
}

interface OptionProps {
  avatar: AvatarOption;
  isSelected: boolean;
  onSelect: (avatarId: string) => void;
}

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

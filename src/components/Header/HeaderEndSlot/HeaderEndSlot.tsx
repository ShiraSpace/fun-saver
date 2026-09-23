'use client';

import { JSX } from 'react';
import type { Account } from '@/lib/types';
import { HomeAvatarLink } from '../HomeAvatarLink';
import { HEADER_AVATAR_PROPS, HEADER_TEST_IDS } from '../constants';
import { HeaderAvatar } from '../header-parts';

interface HeaderEndSlotProps {
  account: Pick<Account, 'name' | 'avatarId'>;
  isHome: boolean;
  isHidden: boolean;
}

export function HeaderEndSlot({
  account,
  isHome,
  isHidden,
}: HeaderEndSlotProps): JSX.Element {
  if (isHome) {
    return (
      <HeaderAvatar
        avatarId={account.avatarId}
        alt={account.name}
        size={HEADER_AVATAR_PROPS.size}
        testId={HEADER_TEST_IDS.avatar}
        isHidden={isHidden}
      />
    );
  }

  return (
    <HomeAvatarLink
      avatarId={account.avatarId}
      name={account.name}
      isHidden={isHidden}
    />
  );
}

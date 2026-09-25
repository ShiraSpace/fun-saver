'use client';

import { JSX } from 'react';
import type { Account } from '@/lib/account/types';
import { HomeAvatarLink } from '../HomeAvatarLink';
import { HEADER_AVATAR_PROPS, HEADER_TEST_IDS } from '../constants';
import { HeaderAvatar } from '../header-parts';

interface HeaderAccountAvatarProps {
  account: Pick<Account, 'name' | 'avatarId'>;
  isHome: boolean;
  isHidden: boolean;
}

export function HeaderAccountAvatar({
  account,
  isHome,
  isHidden,
}: HeaderAccountAvatarProps): JSX.Element {
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
      accountName={account.name}
      isHidden={isHidden}
    />
  );
}

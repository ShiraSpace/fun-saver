'use client';

import { JSX } from 'react';
import { HOME_ROUTE } from '../../Home/constants';
import { useAccounts } from '../../Home/accounts-context';
import {
  HEADER_AVATAR_PROPS,
  HEADER_CONTENT,
  HEADER_TEST_IDS,
} from '../constants';
import { HeaderAvatar } from '../header-parts';
import { HouseBadge, Ring } from './HomeAvatarLink.styles';

interface HomeAvatarLinkProps {
  isHidden: boolean;
}

export function HomeAvatarLink({ isHidden }: HomeAvatarLinkProps): JSX.Element {
  const { currentAccount } = useAccounts();

  return (
    <Ring
      href={HOME_ROUTE}
      aria-label={HEADER_CONTENT.homeLabel}
      data-testid={HEADER_TEST_IDS.homeLink}
      data-hidden={isHidden}
    >
      <HeaderAvatar
        avatarId={currentAccount.avatarId}
        alt={currentAccount.name}
        size={HEADER_AVATAR_PROPS.size}
        testId={HEADER_TEST_IDS.avatar}
        isHidden={false}
      />
      <HouseBadge aria-hidden>{HEADER_CONTENT.homeIcon}</HouseBadge>
    </Ring>
  );
}

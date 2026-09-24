'use client';

import { JSX } from 'react';
import { HOME_ROUTE } from '../../Home/constants';
import {
  HEADER_AVATAR_PROPS,
  HEADER_CONTENT,
  HEADER_TEST_IDS,
} from '../constants';
import { HeaderAvatar } from '../header-parts';
import { PendingNavigationReporter } from '../navigation-pending-context';
import { HouseBadge, Ring } from './HomeAvatarLink.styles';

interface HomeAvatarLinkProps {
  avatarId: string;
  accountName: string;
  isHidden: boolean;
}

export function HomeAvatarLink({
  avatarId,
  accountName,
  isHidden,
}: HomeAvatarLinkProps): JSX.Element {
  return (
    <Ring
      href={HOME_ROUTE}
      aria-label={HEADER_CONTENT.homeLabel(accountName)}
      data-testid={HEADER_TEST_IDS.homeLink}
      data-hidden={isHidden}
    >
      <HeaderAvatar
        avatarId={avatarId}
        alt={accountName}
        size={HEADER_AVATAR_PROPS.size}
        testId={HEADER_TEST_IDS.avatar}
        isHidden={false}
      />
      <HouseBadge aria-hidden>{HEADER_CONTENT.homeIcon}</HouseBadge>
      <PendingNavigationReporter />
    </Ring>
  );
}

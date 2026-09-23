'use client';

import { JSX } from 'react';
import { HOME_ROUTE } from '../../Home/constants';
import {
  HEADER_AVATAR_PROPS,
  HEADER_CONTENT,
  HEADER_TEST_IDS,
} from '../constants';
import { HeaderAvatar } from '../header-parts';
import { HouseBadge, Ring } from './HomeAvatarLink.styles';

interface HomeAvatarLinkProps {
  avatarId: string;
  name: string;
  isHidden: boolean;
}

export function HomeAvatarLink({
  avatarId,
  name,
  isHidden,
}: HomeAvatarLinkProps): JSX.Element {
  return (
    <Ring
      href={HOME_ROUTE}
      aria-label={HEADER_CONTENT.homeLabel(name)}
      data-testid={HEADER_TEST_IDS.homeLink}
      data-hidden={isHidden}
    >
      <HeaderAvatar
        avatarId={avatarId}
        alt={name}
        size={HEADER_AVATAR_PROPS.size}
        testId={HEADER_TEST_IDS.avatar}
        isHidden={false}
      />
      <HouseBadge aria-hidden>{HEADER_CONTENT.homeIcon}</HouseBadge>
    </Ring>
  );
}

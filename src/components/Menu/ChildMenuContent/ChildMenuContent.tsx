'use client';

import { JSX } from 'react';
import { AvatarBadge } from '@/components/AvatarBadge';
import { useAccounts } from '@/components/Home/accounts-context';
import { HOME_ROUTE } from '@/components/Home/constants';
import { VIEW_MODE, isShownToChild } from '@/lib/account/view-mode';
import { AppearanceSection } from '../AppearanceSection';
import { ChildMenuAccountList } from '../ChildMenuAccountList';
import { ViewModeSwitch } from '../ViewModeSwitch';
import { useMenu } from '../use-menu-state';
import { useOpenAccount } from '../use-open-account';
import { ChildMenuCard } from '../child-menu-parts';
import { CHILD_MENU_AVATAR_PROPS } from '../constants';
import {
  CHILD_MENU_CONTENT_COPY,
  CHILD_MENU_CONTENT_TEST_IDS,
} from './constants';
import {
  Child,
  ChildName,
  HomeLink,
  Layout,
  ParentCorner,
} from './ChildMenuContent.styles';

export function ChildMenuContent(): JSX.Element {
  const { accounts, currentAccount } = useAccounts();
  const { closeMenu } = useMenu();
  const openAccount = useOpenAccount();
  const siblingAccounts = accounts.filter(
    (account) => account.id !== currentAccount.id && isShownToChild(account)
  );

  return (
    <Layout data-testid={CHILD_MENU_CONTENT_TEST_IDS.menu}>
      <Child>
        <AvatarBadge
          avatarId={currentAccount.avatarId}
          alt=""
          size={CHILD_MENU_AVATAR_PROPS.size}
        />
        <ChildName>{currentAccount.name}</ChildName>
      </Child>
      <HomeLink
        href={HOME_ROUTE}
        onClick={closeMenu}
        data-testid={CHILD_MENU_CONTENT_TEST_IDS.home}
      >
        <span aria-hidden>{CHILD_MENU_CONTENT_COPY.homeIcon}</span>
        {CHILD_MENU_CONTENT_COPY.home}
      </HomeLink>
      <ChildMenuAccountList
        siblingAccounts={siblingAccounts}
        onSelect={openAccount}
      />
      <ChildMenuCard>
        <AppearanceSection />
      </ChildMenuCard>
      <ParentCorner>
        <ViewModeSwitch viewMode={VIEW_MODE.parent} />
      </ParentCorner>
    </Layout>
  );
}

'use client';

import { JSX } from 'react';
import { Avatar } from '@/components/Avatar/Avatar';
import { useAccounts } from '@/components/Home/accounts-context';
import { HOME_ROUTE } from '@/components/Home/constants';
import { APP_VIEW_MODE } from '@/lib/account/view-mode';
import { AppearanceSection } from '../AppearanceSection';
import { ViewModeSwitch } from '../ViewModeSwitch';
import { useMenu } from '../use-menu-state';
import {
  CHILD_MENU_AVATAR_PROPS,
  CHILD_MENU_CONTENT_COPY,
  CHILD_MENU_CONTENT_TEST_IDS,
} from './constants';
import {
  Child,
  ChildName,
  HomeLink,
  Item,
  Layout,
  ParentCorner,
} from './ChildMenuContent.styles';

export function ChildMenuContent(): JSX.Element {
  const { currentAccount } = useAccounts();
  const { closeMenu } = useMenu();

  return (
    <Layout data-testid={CHILD_MENU_CONTENT_TEST_IDS.menu}>
      <Child>
        <Avatar
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
      <Item>
        <AppearanceSection />
      </Item>
      <ParentCorner>
        <ViewModeSwitch viewMode={APP_VIEW_MODE.parent} />
      </ParentCorner>
    </Layout>
  );
}

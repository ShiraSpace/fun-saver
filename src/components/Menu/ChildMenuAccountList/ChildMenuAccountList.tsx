'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { AvatarBadge } from '@/components/AvatarBadge';
import { MenuSectionTitle } from '../MenuSectionTitle';
import { CHILD_MENU_AVATAR_PROPS } from '../constants';
import {
  CHILD_MENU_ACCOUNT_LIST_COPY,
  CHILD_MENU_ACCOUNT_LIST_TEST_IDS,
} from './constants';
import {
  AccountRow,
  Arrow,
  List,
  TitleIcon,
} from './ChildMenuAccountList.styles';

interface ChildMenuAccountListProps {
  accounts: AccountSummary[];
  onSelect: (id: string) => void;
}

export function ChildMenuAccountList({
  accounts,
  onSelect,
}: ChildMenuAccountListProps): JSX.Element {
  return (
    <section>
      <MenuSectionTitle>
        <TitleIcon aria-hidden>{CHILD_MENU_ACCOUNT_LIST_COPY.icon}</TitleIcon>
        {CHILD_MENU_ACCOUNT_LIST_COPY.title}
      </MenuSectionTitle>
      <List data-testid={CHILD_MENU_ACCOUNT_LIST_TEST_IDS.list}>
        {accounts.map((account) => (
          <AccountRow
            key={account.id}
            type="button"
            data-testid={CHILD_MENU_ACCOUNT_LIST_TEST_IDS.row}
            onClick={(): void => onSelect(account.id)}
          >
            <AvatarBadge
              avatarId={account.avatarId}
              alt=""
              size={CHILD_MENU_AVATAR_PROPS.size}
            />
            <span data-testid={CHILD_MENU_ACCOUNT_LIST_TEST_IDS.name}>
              {account.name}
            </span>
            <Arrow aria-hidden>{CHILD_MENU_ACCOUNT_LIST_COPY.arrow}</Arrow>
          </AccountRow>
        ))}
      </List>
    </section>
  );
}

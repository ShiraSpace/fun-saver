'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { MenuSectionTitle } from '../MenuSectionTitle';
import { ChildMenuCard } from '../child-menu-parts';
import {
  CHILD_MENU_ACCOUNT_LIST_COPY,
  CHILD_MENU_ACCOUNT_LIST_TEST_IDS,
} from './constants';
import { ChildMenuAccountRow } from './ChildMenuAccountRow';
import { List, TitleIcon } from './ChildMenuAccountList.styles';

interface ChildMenuAccountListProps {
  siblingAccounts: AccountSummary[];
  onSelect: (id: string) => void;
}

export function ChildMenuAccountList({
  siblingAccounts,
  onSelect,
}: ChildMenuAccountListProps): JSX.Element | null {
  if (siblingAccounts.length === 0) {
    return null;
  }

  const rows = siblingAccounts.map((siblingAccount) => (
    <ChildMenuAccountRow
      key={siblingAccount.id}
      siblingAccount={siblingAccount}
      onSelect={onSelect}
    />
  ));

  return (
    <ChildMenuCard as="section">
      <MenuSectionTitle>
        <TitleIcon aria-hidden>{CHILD_MENU_ACCOUNT_LIST_COPY.icon}</TitleIcon>
        {CHILD_MENU_ACCOUNT_LIST_COPY.title}
      </MenuSectionTitle>
      <List data-testid={CHILD_MENU_ACCOUNT_LIST_TEST_IDS.list}>{rows}</List>
    </ChildMenuCard>
  );
}

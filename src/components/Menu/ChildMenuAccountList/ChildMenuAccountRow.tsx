'use client';

import { JSX } from 'react';
import type { AccountSummary } from '@/lib/account/types';
import { AvatarBadge } from '@/components/AvatarBadge';
import { CHILD_MENU_AVATAR_PROPS } from '../constants';
import {
  CHILD_MENU_ACCOUNT_LIST_COPY,
  CHILD_MENU_ACCOUNT_LIST_TEST_IDS,
} from './constants';
import { AccountRow, Arrow } from './ChildMenuAccountList.styles';

interface ChildMenuAccountRowProps {
  siblingAccount: AccountSummary;
  onSelect: (id: string) => void;
}

export function ChildMenuAccountRow({
  siblingAccount,
  onSelect,
}: ChildMenuAccountRowProps): JSX.Element {
  const handleSelect = (): void => onSelect(siblingAccount.id);

  return (
    <AccountRow
      type="button"
      data-testid={CHILD_MENU_ACCOUNT_LIST_TEST_IDS.row}
      onClick={handleSelect}
    >
      <AvatarBadge
        avatarId={siblingAccount.avatarId}
        alt=""
        size={CHILD_MENU_AVATAR_PROPS.size}
      />
      <span data-testid={CHILD_MENU_ACCOUNT_LIST_TEST_IDS.name}>
        {siblingAccount.name}
      </span>
      <Arrow aria-hidden>{CHILD_MENU_ACCOUNT_LIST_COPY.arrow}</Arrow>
    </AccountRow>
  );
}

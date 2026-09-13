import { JSX } from 'react';
import type { Account } from '@/lib/types';
import {
  ACCOUNTS_SECTION_STYLE,
  ACCOUNTS_SECTION_TEST_IDS,
} from '@/components/Menu/AccountsSection/constants';
import { Avatar } from '@/components/Avatar/Avatar';
import { Chip, Badge } from './AccountChip.styles';

interface AccountChipProps {
  account: Account;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function AccountChip({
  account,
  isSelected,
  onSelect,
}: AccountChipProps): JSX.Element {
  return (
    <Chip
      type="button"
      data-testid={ACCOUNTS_SECTION_TEST_IDS.chip}
      data-selected={isSelected}
      onClick={(): void => onSelect(account.id)}
    >
      <Avatar
        avatarId={account.avatarId}
        alt={account.name}
        size={ACCOUNTS_SECTION_STYLE.avatarSize}
      />
      <Badge>{account.name.charAt(0)}</Badge>
    </Chip>
  );
}

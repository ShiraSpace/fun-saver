import { JSX } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import type { Account } from '@/lib/types';
import {
  ACCOUNTS_SECTION_STYLE,
  ACCOUNTS_SECTION_TEST_IDS,
} from '@/components/Menu/AccountsSection/constants';
import { Avatar } from '@/components/Avatar/Avatar';

interface AccountChipProps {
  account: Account;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const Chip = styled.button`
  position: relative;
  line-height: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: transform ${ACCOUNTS_SECTION_STYLE.pressMs}ms ease;

  img {
    transition: box-shadow ${ACCOUNTS_SECTION_STYLE.ringMs}ms ease;
  }

  &:active {
    transform: scale(${ACCOUNTS_SECTION_STYLE.pressScale});
  }

  &[data-selected='true'] img {
    box-shadow: 0 0 0 ${ACCOUNTS_SECTION_STYLE.ringWidth}px
      ${ACCOUNTS_SECTION_STYLE.ringColor};
  }
`;

const badgeSize = ({ theme }: { theme: Theme }): number =>
  theme.typography.caption;

const Badge = styled.span`
  position: absolute;
  bottom: -2px;
  inset-inline-start: -2px;
  min-width: ${ACCOUNTS_SECTION_STYLE.badgeSize}px;
  height: ${ACCOUNTS_SECTION_STYLE.badgeSize}px;
  padding: 0 4px;
  box-sizing: border-box;
  border-radius: 999px;
  background: ${ACCOUNTS_SECTION_STYLE.badgeBg};
  color: ${ACCOUNTS_SECTION_STYLE.badgeColor};
  font-size: ${badgeSize}px;
  font-weight: 700;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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

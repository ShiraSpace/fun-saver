import { JSX } from 'react';
import styled from '@emotion/styled';
import type { Theme } from '@emotion/react';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_STYLE,
  ACCOUNTS_SECTION_TEST_IDS,
  MenuAccount,
} from '@/components/Menu/AccountsSection/constants';
import { Avatar } from '@/components/Avatar/Avatar';

interface AccountChipProps {
  account: MenuAccount;
}

const Chip = styled.div`
  position: relative;
  line-height: 0;

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

export function AccountChip({ account }: AccountChipProps): JSX.Element {
  const isSelected = account.id === ACCOUNTS_SECTION_CONTENT.selectedId;
  return (
    <Chip
      data-testid={ACCOUNTS_SECTION_TEST_IDS.chip}
      data-selected={isSelected}
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

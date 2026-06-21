'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { Avatar } from '../../Avatar';
import { MenuLabel } from '../MenuLabel';
import {
  ACCOUNTS_SECTION_CONTENT,
  ACCOUNTS_SECTION_STYLE,
  ACCOUNTS_SECTION_TEST_IDS,
  type MenuAccount,
} from './constants';

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${ACCOUNTS_SECTION_STYLE.rowGap}px;
  flex-wrap: wrap;
`;

const Chip = styled.div`
  position: relative;
  line-height: 0;

  &[data-selected='true'] img {
    box-shadow: 0 0 0 ${ACCOUNTS_SECTION_STYLE.ringWidth}px
      ${ACCOUNTS_SECTION_STYLE.ringColor};
  }
`;

const ActionChip = styled.button`
  width: ${ACCOUNTS_SECTION_STYLE.avatarSize}px;
  height: ${ACCOUNTS_SECTION_STYLE.avatarSize}px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  color: currentColor;
  font-size: ${ACCOUNTS_SECTION_STYLE.actionFontSize}px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
`;

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
  font-size: ${ACCOUNTS_SECTION_STYLE.badgeFontSize}px;
  font-weight: 700;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function AccountChip({ account }: { account: MenuAccount }): JSX.Element {
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

export function AccountsSection(): JSX.Element {
  return (
    <section data-testid={ACCOUNTS_SECTION_TEST_IDS.section}>
      <MenuLabel>{ACCOUNTS_SECTION_CONTENT.label}</MenuLabel>
      <Row>
        {ACCOUNTS_SECTION_CONTENT.accounts.map((account) => (
          <AccountChip key={account.id} account={account} />
        ))}
        <ActionChip
          type="button"
          aria-label={ACCOUNTS_SECTION_CONTENT.editLabel}
          data-testid={ACCOUNTS_SECTION_TEST_IDS.editChip}
        >
          {ACCOUNTS_SECTION_CONTENT.editIcon}
        </ActionChip>
        <ActionChip
          type="button"
          aria-label={ACCOUNTS_SECTION_CONTENT.addLabel}
          data-testid={ACCOUNTS_SECTION_TEST_IDS.addChip}
        >
          {ACCOUNTS_SECTION_CONTENT.addIcon}
        </ActionChip>
      </Row>
    </section>
  );
}

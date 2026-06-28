'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { MONEY_COPY } from '../../../Money/constants';
import { DrawerError } from '../../drawer-parts';
import {
  TRANSACTION_DRAWER_COPY,
  TRANSACTION_DRAWER_TEST_IDS,
} from '../../constants';
import { WITHDRAW_BODY_COPY, WITHDRAW_BODY_TEST_IDS } from '../constants';

const Overdraft = styled.span`
  text-align: center;
  font-size: ${({ theme }): number => theme.typography.label}px;
  font-weight: 600;
  color: ${({ theme }): string => theme.colors.alert};
  background: ${({ theme }): string => theme.colors.alertSoftBg};
  border-radius: 12px;
  padding: 7px 10px;
`;

interface WithdrawMessageProps {
  isOverdraft: boolean;
  hasError: boolean;
  balanceShekels: number;
}

export function WithdrawMessage({
  isOverdraft,
  hasError,
  balanceShekels,
}: WithdrawMessageProps): JSX.Element | null {
  if (isOverdraft) {
    return (
      <Overdraft data-testid={WITHDRAW_BODY_TEST_IDS.overdraft}>
        {WITHDRAW_BODY_COPY.overdraftPrefix} {MONEY_COPY.currency}
        {balanceShekels}
      </Overdraft>
    );
  }

  if (hasError) {
    return (
      <DrawerError data-testid={TRANSACTION_DRAWER_TEST_IDS.error}>
        {TRANSACTION_DRAWER_COPY.error}
      </DrawerError>
    );
  }

  return null;
}

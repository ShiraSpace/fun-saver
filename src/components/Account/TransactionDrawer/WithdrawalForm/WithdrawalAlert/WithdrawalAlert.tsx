'use client';

import { JSX } from 'react';
import { MONEY_COPY } from '@/components/Money/constants';
import { DrawerError } from '../../drawer-parts';
import {
  TRANSACTION_DRAWER_COPY,
  TRANSACTION_DRAWER_TEST_IDS,
} from '../../constants';
import { WITHDRAWAL_FORM_COPY, WITHDRAWAL_FORM_TEST_IDS } from '../constants';
import { Overdraft } from './WithdrawalAlert.styles';

interface WithdrawalAlertProps {
  isOverdraft: boolean;
  hasError: boolean;
  balanceShekels: number;
}

export function WithdrawalAlert({
  isOverdraft,
  hasError,
  balanceShekels,
}: WithdrawalAlertProps): JSX.Element | null {
  if (isOverdraft) {
    return (
      <Overdraft data-testid={WITHDRAWAL_FORM_TEST_IDS.overdraft}>
        {WITHDRAWAL_FORM_COPY.overdraftPrefix} {MONEY_COPY.currencySign}
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

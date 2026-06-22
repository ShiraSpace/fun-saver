'use client';

import { JSX } from 'react';
import styled from '@emotion/styled';
import { COLORS } from '@/theme/palette';
import { ActionButton } from '@/components/ActionButton';
import { MONEY_COPY } from '../Money/constants';
import { AmountPad } from './AmountPad';
import { DepositAmount } from './DepositAmount';
import { DepositSplit } from './DepositSplit';
import { useDepositForm } from './use-deposit-form';
import {
  TRANSACTION_DRAWER_COPY,
  TRANSACTION_DRAWER_STYLE,
  TRANSACTION_DRAWER_TEST_IDS,
} from './constants';

const Scrim = styled.div`
  position: fixed;
  inset: 0;
  background: ${TRANSACTION_DRAWER_STYLE.scrim};
  z-index: 10;
`;

const Sheet = styled.div`
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: 11;
  width: 100%;
  max-width: ${TRANSACTION_DRAWER_STYLE.maxWidth}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${TRANSACTION_DRAWER_STYLE.gap}px;
  padding: 10px 18px 18px;
  background: ${TRANSACTION_DRAWER_STYLE.sheetBg};
  border-radius: ${TRANSACTION_DRAWER_STYLE.sheetRadius}px
    ${TRANSACTION_DRAWER_STYLE.sheetRadius}px 0 0;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.25);
`;

const Handle = styled.div`
  width: 44px;
  height: 5px;
  border-radius: 999px;
  background: ${TRANSACTION_DRAWER_STYLE.handleColor};
  margin: 2px auto;
`;

const Title = styled.span`
  text-align: center;
  font-size: ${TRANSACTION_DRAWER_STYLE.titleSize}px;
  font-weight: 700;
  color: ${({ theme }): string => theme.colors.textStrong};
`;

const ErrorText = styled.span`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${COLORS.accent};
`;

interface TransactionDrawerProps {
  accountId: string;
  onClose: () => void;
}

export function TransactionDrawer({
  accountId,
  onClose,
}: TransactionDrawerProps): JSX.Element {
  const {
    amount,
    split,
    isSubmitting,
    hasError,
    canSubmit,
    onDigit,
    onClear,
    onBackspace,
    onConfirm,
  } = useDepositForm(accountId, onClose);

  const submitButtonText = isSubmitting
    ? TRANSACTION_DRAWER_COPY.submitting
    : `${TRANSACTION_DRAWER_COPY.confirm} ${MONEY_COPY.currency}${amount}`;

  return (
    <>
      <Scrim
        data-testid={TRANSACTION_DRAWER_TEST_IDS.scrim}
        onClick={onClose}
      />
      <Sheet data-testid={TRANSACTION_DRAWER_TEST_IDS.drawer}>
        <Handle />
        <Title>{TRANSACTION_DRAWER_COPY.title}</Title>
        <DepositAmount amount={amount} />
        <DepositSplit split={split} />
        <AmountPad
          onDigit={onDigit}
          onClear={onClear}
          onBackspace={onBackspace}
        />
        {hasError && (
          <ErrorText data-testid={TRANSACTION_DRAWER_TEST_IDS.error}>
            {TRANSACTION_DRAWER_COPY.error}
          </ErrorText>
        )}
        <ActionButton
          type="button"
          data-testid={TRANSACTION_DRAWER_TEST_IDS.confirm}
          disabled={!canSubmit}
          onClick={onConfirm}
        >
          {submitButtonText}
        </ActionButton>
      </Sheet>
    </>
  );
}

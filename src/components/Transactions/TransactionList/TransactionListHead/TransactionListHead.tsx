import { JSX } from 'react';
import { CHOICE_CHIPS_VARIANT, ChoiceChips } from '../../ChoiceChips';
import type { TransactionsViewChoices } from '../../use-transactions-view-choices';
import {
  INTEREST_MODES,
  TRANSACTION_LIST_COPY,
  TRANSACTION_LIST_INTEREST_GROUP_NAME,
  TRANSACTION_LIST_TEST_IDS,
  TRANSACTION_LIST_TYPE_GROUP_NAME,
  TRANSACTION_TYPE_FILTERS,
} from '../constants';
import {
  Count,
  Head,
  SubTitle,
  Title,
  TitleRow,
} from './TransactionListHead.styles';

interface TransactionListHeadProps {
  rowCount: number;
  dayCount: number;
  viewChoices: TransactionsViewChoices;
}

export function TransactionListHead({
  rowCount,
  dayCount,
  viewChoices,
}: TransactionListHeadProps): JSX.Element {
  const countText = TRANSACTION_LIST_COPY.count(rowCount, dayCount);

  return (
    <Head>
      <TitleRow>
        <Title>{TRANSACTION_LIST_COPY.title}</Title>
        <Count data-testid={TRANSACTION_LIST_TEST_IDS.count}>{countText}</Count>
      </TitleRow>
      <ChoiceChips
        groupName={TRANSACTION_LIST_TYPE_GROUP_NAME}
        legend={TRANSACTION_LIST_COPY.filterLegend}
        choices={TRANSACTION_TYPE_FILTERS}
        selected={viewChoices.transactionTypeFilter}
        onSelect={viewChoices.setTransactionTypeFilter}
        testId={TRANSACTION_LIST_TEST_IDS.filters}
      />
      <SubTitle
        aria-hidden
        data-testid={TRANSACTION_LIST_TEST_IDS.interestTitle}
      >
        {TRANSACTION_LIST_COPY.interestTitle}
      </SubTitle>
      <ChoiceChips
        variant={CHOICE_CHIPS_VARIANT.segmented}
        groupName={TRANSACTION_LIST_INTEREST_GROUP_NAME}
        legend={TRANSACTION_LIST_COPY.interestTitle}
        choices={INTEREST_MODES}
        selected={viewChoices.interestMode}
        onSelect={viewChoices.setInterestMode}
        testId={TRANSACTION_LIST_TEST_IDS.interestMode}
      />
    </Head>
  );
}

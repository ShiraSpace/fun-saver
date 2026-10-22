export const TRANSACTION_MONTH_COPY = {
  interestThisMonth: 'ריבית החודש',
} as const;

export const TRANSACTION_MONTH_TEST_IDS = {
  interestThisMonth: (month: string): string => `transaction-month-${month}-interest`,
  monthName: (month: string): string => `transaction-month-${month}`,
  columnNames: (month: string): string => `transaction-month-${month}-column-names`,
} as const;

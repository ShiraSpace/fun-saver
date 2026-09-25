export const TRANSACTION_MONTH_TEST_IDS = {
  monthName: (month: string): string => `transaction-month-${month}`,
  columnNames: (month: string): string =>
    `transaction-month-${month}-column-names`,
} as const;

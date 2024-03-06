export type FinancialOperationTypeValue =
  (typeof FinancialOperationType)[keyof typeof FinancialOperationType];

export const FinancialOperationType = {
  EXPENSE: 'expense',
  DEPOSIT: 'deposit',
} as const;

export const DateKeyword = {
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year',
} as const;

export type DateKeywordType = (typeof DateKeyword)[keyof typeof DateKeyword];

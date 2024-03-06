import {
  FinancialOperationType,
  FinancialOperationTypeValue,
} from '../types/globalTypes';

export const getNetAmount = (transaction: {
  amount: string;
  type: FinancialOperationTypeValue;
}) => {
  if (transaction.type === FinancialOperationType.DEPOSIT) {
    return parseFloat(transaction.amount);
  }

  return -parseFloat(transaction.amount);
};

export function alpha(color: string, opacity: number): string {
  const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
}

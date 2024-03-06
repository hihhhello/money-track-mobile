'use client';

import {
  addDays,
  addMonths,
  addYears,
  format,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import { Pressable, View } from 'react-native';

import { Text } from './Text';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';
import { COLORS } from '../theme';
import {
  TransactionPeriodFilterType,
  TransactionPeriodFilter,
} from '../types/transactionTypes';

type TransactionsDateFilterProps = {
  value: Date;
  handleChangeValue: (newDate: Date) => void;
  period: TransactionPeriodFilterType;
};

export const TransactionsDateFilter = ({
  handleChangeValue,
  value,
  period,
}: TransactionsDateFilterProps) => {
  const handlePrevClick = () => {
    if (period === TransactionPeriodFilter.DAY) {
      handleChangeValue(subDays(value, 1));

      return;
    }

    if (period === TransactionPeriodFilter.MONTH) {
      handleChangeValue(subMonths(value, 1));

      return;
    }

    if (period === TransactionPeriodFilter.YEAR) {
      handleChangeValue(subYears(value, 1));
    }
  };

  const handleNextClick = () => {
    if (period === TransactionPeriodFilter.DAY) {
      handleChangeValue(addDays(value, 1));

      return;
    }

    if (period === TransactionPeriodFilter.MONTH) {
      handleChangeValue(addMonths(value, 1));

      return;
    }

    if (period === TransactionPeriodFilter.YEAR) {
      handleChangeValue(addYears(value, 1));
    }
  };

  return (
    <View
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        minWidth: 110,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 9999,
        backgroundColor: COLORS.main.blue,
        paddingVertical: 6,
        paddingHorizontal: 16,
      }}
    >
      <Pressable
        onPress={handlePrevClick}
        hitSlop={{ bottom: 10, top: 10, left: 20, right: 20 }}
      >
        <ChevronDownIcon
          style={{
            transform: [{ rotate: '90deg' }],
          }}
          height={20}
          width={20}
          color="#fff"
        />
      </Pressable>

      <Text style={{ color: '#fff' }} numberOfLines={1}>
        {format(value, PERIOD_TO_FORMAT_PATTERN[period])}
      </Text>

      <Pressable
        onPress={handleNextClick}
        hitSlop={{ bottom: 10, top: 10, left: 20, right: 20 }}
      >
        <ChevronDownIcon
          style={{
            transform: [{ rotate: '-90deg' }],
          }}
          height={20}
          width={20}
          color="#fff"
        />
      </Pressable>
    </View>
  );
};

const PERIOD_TO_FORMAT_PATTERN: Record<TransactionPeriodFilterType, string> = {
  [TransactionPeriodFilter.DAY]: 'dd MMM yyyy',
  [TransactionPeriodFilter.MONTH]: 'MMM yyyy',
  [TransactionPeriodFilter.YEAR]: 'yyyy',
  [TransactionPeriodFilter.ALL]: '',
};

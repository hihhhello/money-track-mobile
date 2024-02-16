import { useQuery } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { formatUSDDecimal } from 'hihhhello-utils';
import { useMemo } from 'react';
import { Pressable, View, Text } from 'react-native';

import { api } from '@/shared/api/api';
import { MinusIcon } from '@/shared/icons/MinusIcon';
import { PlusIcon } from '@/shared/icons/PlusIcon';
import { COLORS } from '@/shared/theme';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import { getNetAmount } from '@/shared/utils/helpers';

export default function HomeScreen() {
  const router = useRouter();

  const { data: transactions } = useQuery({
    queryFn: api.transactions.getAll,
    queryKey: ['api.transactions.getAll'],
  });

  const totalTransactionsAmount = useMemo(
    () =>
      transactions
        ? transactions.reduce(
            (totalExpensesAccumulator, transaction) =>
              totalExpensesAccumulator +
              getNetAmount({
                type: transaction.type,
                amount: transaction.amount,
              }),
            0,
          )
        : 0,
    [transactions],
  );

  return (
    <View>
      <Stack.Screen
        options={{
          title: '',
        }}
      />

      <View
        style={{
          backgroundColor: COLORS.main.dark,
          paddingHorizontal: 24,
          paddingBottom: 20,
          paddingTop: 16,
          borderRadius: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: 8,
          marginBottom: 16,
        }}
      >
        <View>
          <Text
            style={{
              color: COLORS.main.white,
              fontSize: 20,
            }}
          >
            Expenses
          </Text>
        </View>

        <Text
          style={{
            color: COLORS.main.white,
            fontSize: 30,
          }}
        >
          {formatUSDDecimal(Math.abs(totalTransactionsAmount))}
        </Text>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 16,
        }}
      >
        <Pressable
          onPress={() => {
            router.push({
              pathname: '/add-transaction',
              params: { type: FinancialOperationType.EXPENSE },
            });
          }}
          style={{
            backgroundColor: COLORS.main.blue,
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 24,
            paddingVertical: 8,
          }}
        >
          <MinusIcon color={COLORS.main.white} height={40} width={40} />
        </Pressable>

        <Pressable
          onPress={() => {
            router.push({
              pathname: '/add-transaction',
              params: { type: FinancialOperationType.DEPOSIT },
            });
          }}
          style={{
            borderWidth: 6,
            borderColor: COLORS.main.blue,
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 24,
            paddingVertical: 8,
          }}
        >
          <PlusIcon color={COLORS.main.blue} height={40} width={40} />
        </Pressable>
      </View>
    </View>
  );
}

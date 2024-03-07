import { useMutation, useQuery } from '@tanstack/react-query';
import { format, formatISO, parseISO } from 'date-fns';
import { Stack, useRouter } from 'expo-router';
import { formatUSDDecimal } from 'hihhhello-utils';
import { isEmpty } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { api } from '@/shared/api/api';
import { MinusIcon } from '@/shared/icons/MinusIcon';
import { PencilIcon } from '@/shared/icons/PencilIcon';
import { PlusIcon } from '@/shared/icons/PlusIcon';
import { RecurrentTransactionIcon } from '@/shared/icons/RecurrentTransactionIcon';
import { TrashIcon } from '@/shared/icons/TrashIcon';
import { COLORS } from '@/shared/theme';
import { FinancialOperationType } from '@/shared/types/globalTypes';
import {
  TransactionPeriodFilter,
  TransactionPeriodFilterType,
  TransactionsByCategory,
} from '@/shared/types/transactionTypes';
import { Text } from '@/shared/ui/Text';
import { TransactionsDateFilter } from '@/shared/ui/TransactionsDateFilter';
import { TransactionsPeriodFilterSelect } from '@/shared/ui/TransactionsPeriodFilterSelect';
import {
  DATE_KEYWORD_TO_DATE_RANGE,
  DateRange,
} from '@/shared/utils/dateUtils';
import { getNetAmount } from '@/shared/utils/helpers';

export default function HomeScreen() {
  const router = useRouter();

  const [transactionsPeriodFilter, setTransactionsPeriodFilter] =
    useState<TransactionPeriodFilterType>(TransactionPeriodFilter.MONTH);
  const [transactionsDateFilter, setTransactionsDateFilter] = useState<Date>(
    new Date(),
  );

  const transactionsDateRange: DateRange | undefined = useMemo(() => {
    if (transactionsPeriodFilter === TransactionPeriodFilter.ALL) {
      return undefined;
    }

    if (transactionsPeriodFilter === TransactionPeriodFilter.MONTH) {
      return DATE_KEYWORD_TO_DATE_RANGE[TransactionPeriodFilter.MONTH]({
        referenceDate: transactionsDateFilter,
      });
    }

    if (transactionsPeriodFilter === TransactionPeriodFilter.YEAR) {
      return DATE_KEYWORD_TO_DATE_RANGE[TransactionPeriodFilter.YEAR]({
        referenceDate: transactionsDateFilter,
      });
    }

    return DATE_KEYWORD_TO_DATE_RANGE[TransactionPeriodFilter.DAY]({
      referenceDate: transactionsDateFilter,
    });
  }, [transactionsDateFilter, transactionsPeriodFilter]);

  const transactionsQuery = useQuery({
    queryFn: ({ queryKey }) => {
      const dateRange = queryKey[1] as unknown as DateRange;

      return api.transactions.getAll({
        searchParams: {
          ...(dateRange && {
            endDate: dateRange.endDate
              ? formatISO(dateRange.endDate, { representation: 'date' })
              : undefined,
            startDate: formatISO(dateRange.startDate, {
              representation: 'date',
            }),
          }),
        },
      });
    },
    queryKey: ['api.transactions.getAll', transactionsDateRange],
  });

  const totalTransactionsAmount = useMemo(
    () =>
      transactionsQuery.data
        ? transactionsQuery.data.reduce(
            (totalExpensesAccumulator, transaction) =>
              totalExpensesAccumulator +
              getNetAmount({
                type: transaction.type,
                amount: transaction.amount,
              }),
            0,
          )
        : 0,
    [transactionsQuery.data],
  );

  const deleteTransactionMutation = useMutation({
    mutationFn: api.transactions.deleteOne,
    mutationKey: ['api.transactions.deleteOne'],
    onSuccess: () => transactionsQuery.refetch(),
  });

  const handleDeleteTransaction = (id: number) => () => {
    deleteTransactionMutation.mutate({
      params: {
        transactionId: id,
      },
    });
  };

  const handleChangeFilter = useCallback(
    (newFilter: TransactionPeriodFilterType) => {
      setTransactionsPeriodFilter(newFilter);
      setTransactionsDateFilter(new Date());
    },
    [],
  );

  const transactionsByCategory = Object.fromEntries(
    Object.entries(
      (transactionsQuery.data ?? []).reduce<TransactionsByCategory>(
        (acc, transaction) => {
          const category = transaction.category.name;

          const updatedCategoryTransactions = [
            ...(acc[category]?.transactions ?? []),
            transaction,
          ];

          const updatedTotalAmount =
            (acc[category]?.totalAmount ?? 0) - parseFloat(transaction.amount);

          return {
            ...acc,
            [category]: {
              transactions: updatedCategoryTransactions,
              totalAmount: updatedTotalAmount,
              type:
                updatedTotalAmount >= 0
                  ? FinancialOperationType.DEPOSIT
                  : FinancialOperationType.EXPENSE,
            },
          };
        },
        {},
      ),
    ).sort(([, a], [, b]) => a.totalAmount - b.totalAmount),
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          /**
           * TODO: find fix
           */
          title: '',
        }}
      />

      <View
        style={{
          marginBottom: 16,
          display: 'flex',
          gap: 16,
          flexDirection: 'row',
          zIndex: 10,
        }}
      >
        <TransactionsPeriodFilterSelect
          value={transactionsPeriodFilter}
          handleChangeValue={handleChangeFilter}
        />

        {transactionsPeriodFilter !== TransactionPeriodFilter.ALL && (
          <TransactionsDateFilter
            handleChangeValue={setTransactionsDateFilter}
            period={transactionsPeriodFilter}
            value={transactionsDateFilter}
          />
        )}
      </View>

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
          marginBottom: 16,
        }}
      >
        <Pressable
          onPress={() => {
            router.push({
              pathname: '/add-transaction',
              params: { type: FinancialOperationType.EXPENSE },
            });
          }}
          style={({ pressed }) => [
            pressed && {
              opacity: 0.8,
            },
            {
              backgroundColor: COLORS.main.blue,
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 24,
              paddingVertical: 8,
            },
          ]}
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
          style={({ pressed }) => [
            pressed && {
              opacity: 0.8,
            },
            {
              borderWidth: 6,
              borderColor: COLORS.main.blue,
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 24,
              paddingVertical: 8,
            },
          ]}
        >
          <PlusIcon color={COLORS.main.blue} height={40} width={40} />
        </Pressable>
      </View>

      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.main.paper,
          padding: 12,
          borderRadius: 24,
        }}
      >
        {/* 
        TODO: improve performance by decomposing or using RecyclerListView
         */}
        <FlatList
          style={{
            paddingTop: 12,
          }}
          refreshControl={
            <RefreshControl
              refreshing={
                transactionsQuery.isFetching ||
                deleteTransactionMutation.isPending
              }
              onRefresh={transactionsQuery.refetch}
            />
          }
          data={transactionsQuery.data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({
            item: {
              amount,
              category: { name: categoryName, id: categoryId },
              description,
              id,
              date,
              type,
              recurrent_id: recurrentTransactionId,
              spending_groups: spendingGroups,
            },
          }) => (
            <Swipeable
              key={id}
              containerStyle={{
                marginBottom: 12,
                position: 'relative',
                overflow: 'visible',
              }}
              renderRightActions={() => (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <Pressable
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: COLORS.main.blue,
                      width: 80,
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                    }}
                    onPress={() => {
                      router.push({
                        pathname: '/edit-transaction',
                        params: {
                          type,
                          id,
                          categoryId,
                          description,
                          amount,
                          date,
                        },
                      });
                    }}
                  >
                    <PencilIcon color="#fff" />

                    <Text
                      style={{
                        color: '#fff',
                      }}
                    >
                      Edit
                    </Text>
                  </Pressable>

                  <Pressable
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      backgroundColor: COLORS.main.orange,
                      width: 80,
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                    }}
                    onPress={handleDeleteTransaction(id)}
                  >
                    <TrashIcon color="#fff" />

                    <Text
                      style={{
                        color: '#fff',
                      }}
                    >
                      Delete
                    </Text>
                  </Pressable>
                </View>
              )}
              overshootLeft={false}
            >
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  zIndex: 40,
                  display: 'flex',
                  transform: [{ translateY: -4 }, { translateX: 4 }],
                  gap: 4,
                }}
              >
                {spendingGroups?.map((group) => (
                  <View
                    key={group.id}
                    style={{
                      backgroundColor: COLORS.main.blue,
                      paddingHorizontal: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: '#fff',
                      }}
                    >
                      {group.name}
                    </Text>
                  </View>
                ))}
              </View>

              <View
                style={{
                  backgroundColor: '#fff',
                  padding: 8,
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 64,
                  paddingTop: !isEmpty(spendingGroups) ? 16 : 0,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                    }}
                    numberOfLines={1}
                  >
                    {categoryName}
                  </Text>

                  <Text numberOfLines={1}>{description}</Text>
                </View>

                <View>
                  <View
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                      gap: 4,
                    }}
                  >
                    <View>
                      {recurrentTransactionId && (
                        <RecurrentTransactionIcon color={COLORS.main.blue} />
                      )}
                    </View>

                    <Text style={{ textAlign: 'right' }}>
                      {format(parseISO(date), 'EEE, dd MMM')}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color:
                        type === FinancialOperationType.EXPENSE
                          ? COLORS.main.orange
                          : COLORS.main.blue,
                      textAlign: 'right',
                    }}
                  >
                    {formatUSDDecimal(parseFloat(amount))}
                  </Text>
                </View>
              </View>
            </Swipeable>
          )}
        />
      </View>
    </View>
  );
}

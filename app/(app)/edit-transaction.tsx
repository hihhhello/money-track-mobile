import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatISO, parseISO } from 'date-fns';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Button,
  View,
  FlatList,
  Pressable,
  Keyboard,
  ActivityIndicator,
} from 'react-native';

import { api } from '@/shared/api/api';
import { SquaresPlusIcon } from '@/shared/icons/SquaresPlusIcon';
import { COLORS } from '@/shared/theme';
import { FinancialOperationTypeValue } from '@/shared/types/globalTypes';
import { Text } from '@/shared/ui/Text';
import { TextInput } from '@/shared/ui/TextInput';

type TransactionValues = {
  amount: number | null;
  date: Date;
  description: string | null;
};

export default function EditTransactionScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const transaction = useLocalSearchParams<{
    type: FinancialOperationTypeValue;
    id: string;
    categoryId: string;
    description: string;
    amount: string;
    date: string;
  }>();

  const today = new Date();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    transaction.categoryId ? Number(transaction.categoryId) : null,
  );

  const [transactionValues, setTransactionValues] = useState<TransactionValues>(
    {
      date: transaction.date ? parseISO(transaction.date) : today,
      amount: transaction.amount ? parseFloat(transaction.amount) : null,
      description: transaction.description ?? null,
    },
  );

  const categoriesQuery = useQuery({
    queryFn: () => {
      if (!transaction.type) {
        return [];
      }

      return api.categories.getAll({
        searchParams: {
          type: transaction.type,
        },
      });
    },
    queryKey: ['api.categories.getAll', transaction.type],
    enabled: Boolean(transaction.type),
  });

  const createTransactionMutation = useMutation({
    mutationFn: api.transactions.createOne,
    mutationKey: ['api.transactions.createOne'],
    onSuccess: () => {
      queryClient
        .refetchQueries({
          queryKey: ['api.transactions.getAll'],
        })
        .then(() => {
          router.back();
        });
    },
    onError: (error) => {
      console.log(error.message);
    },
  });

  const handleCreateTransaction = () => {
    if (!transactionValues.amount || !selectedCategoryId || !transaction.type) {
      return;
    }

    createTransactionMutation.mutate({
      body: {
        amount: transactionValues.amount.toString(),
        category_id: selectedCategoryId,
        date: formatISO(transactionValues.date, {
          representation: 'date',
        }),
        type: transaction.type,
        description: transactionValues.description,
      },
    });
  };

  return (
    <Pressable
      onPress={Keyboard.dismiss}
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          display: 'flex',
          gap: 16,
          flex: 1,
        }}
      >
        <Stack.Screen
          options={{
            title: `Edit ${transaction.type}`,
            headerLeft: () => (
              <Button onPress={() => router.back()} title="Cancel" />
            ),
          }}
        />

        <TextInput
          returnKeyType="done"
          placeholder="Amount"
          onChangeText={(text) =>
            setTransactionValues((prevValues) => ({
              ...prevValues,
              amount: text ? parseFloat(text) : 0,
            }))
          }
          value={transactionValues.amount?.toString() ?? ''}
          inputMode="decimal"
        />

        <View>
          <Text
            style={{
              marginBottom: 8,
            }}
          >
            Category
          </Text>

          <FlatList
            data={categoriesQuery.data}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setSelectedCategoryId(item.id);
                }}
              >
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <View
                    style={[
                      {
                        height: 64,
                        width: 64,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 100,
                        backgroundColor: COLORS.main.paper,
                      },
                      selectedCategoryId === item.id && {
                        backgroundColor: COLORS.main.dark,
                      },
                    ]}
                  >
                    <SquaresPlusIcon
                      width={32}
                      height={32}
                      color={selectedCategoryId === item.id ? '#fff' : '#000'}
                    />
                  </View>

                  <Text
                    numberOfLines={1}
                    style={{ width: 80, textAlign: 'center' }}
                  >
                    {item.name}
                  </Text>
                </View>
              </Pressable>
            )}
            style={{
              maxHeight: 268,
              overflow: 'hidden',
            }}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
          />
        </View>

        <DateTimePicker
          value={transactionValues.date}
          onChange={(_, selectedDate) => {
            if (!selectedDate) {
              return;
            }

            setTransactionValues((prevValues) => ({
              ...prevValues,
              date: selectedDate,
            }));
          }}
        />

        <TextInput
          placeholder="Description"
          onChangeText={(text) =>
            setTransactionValues((prevValues) => ({
              ...prevValues,
              description: text,
            }))
          }
          value={transactionValues.description ?? ''}
        />

        {createTransactionMutation.isPending ? (
          <ActivityIndicator />
        ) : (
          <Button title="Add" onPress={handleCreateTransaction} />
        )}
      </View>
    </Pressable>
  );
}

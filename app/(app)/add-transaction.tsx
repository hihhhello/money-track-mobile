import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatISO } from 'date-fns';
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

export default function AddTransactionScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { type: transactionType } = useLocalSearchParams<{
    type: FinancialOperationTypeValue;
  }>();

  const today = new Date();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const [transactionValues, setTransactionValues] = useState<TransactionValues>(
    {
      date: today,
      amount: null,
      description: null,
    },
  );

  const categoriesQuery = useQuery({
    queryFn: () => {
      if (!transactionType) {
        return [];
      }

      return api.categories.getAll({
        searchParams: {
          type: transactionType,
        },
      });
    },
    queryKey: ['api.categories.getAll', transactionType],
    enabled: Boolean(transactionType),
  });

  const createTransactionMutation = useMutation({
    mutationFn: () => {
      if (
        !transactionValues.amount ||
        !selectedCategoryId ||
        !transactionType
      ) {
        return Promise.reject();
      }

      return api.transactions.createOne({
        body: {
          amount: transactionValues.amount.toString(),
          category_id: selectedCategoryId,
          date: formatISO(transactionValues.date, {
            representation: 'date',
          }),
          type: transactionType,
          description: transactionValues.description,
        },
      });
    },
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
  });

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
            title: `New ${transactionType}`,
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
          <Button
            title="Add"
            onPress={() => {
              createTransactionMutation.mutate();
            }}
          />
        )}
      </View>
    </Pressable>
  );
}

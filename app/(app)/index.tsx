import { useQuery } from '@tanstack/react-query';
import { Link, Stack, useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/shared/api/api';
import { FinancialOperationType } from '@/shared/types/globalTypes';

export default function HomeScreen() {
  const router = useRouter();

  const { signOut } = useAuth();

  const { data: transactions } = useQuery({
    queryFn: api.transactions.getAll,
    queryKey: ['api.transactions.getAll'],
  });

  return (
    <View>
      <Stack.Screen
        options={{
          title: 'Home Screen',
          headerStyle: { backgroundColor: '#f4511e' },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <Button
        title="Expense"
        onPress={() => {
          router.push({
            pathname: '/add-transaction',
            params: { type: FinancialOperationType.EXPENSE },
          });
        }}
      />
      <Button
        title="Deposit"
        onPress={() => {
          router.push({
            pathname: '/add-transaction',
            params: { type: FinancialOperationType.DEPOSIT },
          });
        }}
      />
    </View>
  );
}

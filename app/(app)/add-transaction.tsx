import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Button, View } from 'react-native';

import { FinancialOperationTypeValue } from '@/shared/types/globalTypes';

export default function AddTransactionScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{
    type: FinancialOperationTypeValue;
  }>();

  return (
    <View>
      <Stack.Screen
        options={{
          title: `New ${type}`,
          headerLeft: () => (
            <Button onPress={() => router.back()} title="Cancel" />
          ),
        }}
      />
    </View>
  );
}

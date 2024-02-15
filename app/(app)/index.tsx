import { useQuery } from '@tanstack/react-query';
import { Button, Text, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';
import { api } from '@/shared/api/api';

export default function HomeScreen() {
  const { signOut } = useAuth();

  const { data: transactions } = useQuery({
    queryFn: api.transactions.getAll,
    queryKey: ['api.transactions.getAll'],
  });

  console.log('transactions', transactions);

  return (
    <View>
      <Text>Home Screen</Text>

      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

import { Redirect, Stack } from 'expo-router';
import { Text } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';

export default function Layout() {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return <Stack />;
}

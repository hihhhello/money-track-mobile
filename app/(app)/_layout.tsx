import { Redirect, Stack } from 'expo-router';
import { Text } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';
import { COLORS } from '@/shared/theme';

export default function Layout() {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: COLORS.main.dark,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          paddingHorizontal: 24,
          backgroundColor: '#ffffff',
        },
      }}
    />
  );
}

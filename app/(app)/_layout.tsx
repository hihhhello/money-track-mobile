import { Redirect, Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/providers/AuthProvider';
import { BarChartIcon } from '@/shared/icons/BarChartIcon';
import { SquaresPlusIcon } from '@/shared/icons/SquaresPlusIcon';
import { COLORS } from '@/shared/theme';

export default function Layout() {
  const insets = useSafeAreaInsets();

  const { isLoading, session } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: COLORS.main.dark,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      sceneContainerStyle={{
        paddingHorizontal: 24,
        backgroundColor: '#ffffff',
        paddingBottom: insets.bottom,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <BarChartIcon color={color} />,
        }}
      />

      <Tabs.Screen
        name="add-transaction"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="edit-transaction"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="categories"
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color }) => <SquaresPlusIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

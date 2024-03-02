import { Stack } from 'expo-router';

import { COLORS } from '@/shared/theme';

export default function Layout() {
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
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Stack.Screen
        name="categories"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="add-category"
        options={{
          presentation: 'modal',
          title: 'Add new category',
        }}
      />

      <Stack.Screen
        name="edit-category"
        options={{
          presentation: 'modal',
          title: 'Edit category',
        }}
      />
    </Stack>
  );
}

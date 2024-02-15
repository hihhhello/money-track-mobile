import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/providers/AuthProvider';
import { QueryClientProvider } from '@/providers/QueryClientProvider';

export default function Layout() {
  return (
    <QueryClientProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

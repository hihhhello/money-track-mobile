import {
  useFonts,
  Kanit_100Thin,
  Kanit_200ExtraLight,
  Kanit_300Light,
  Kanit_400Regular,
  Kanit_500Medium,
  Kanit_600SemiBold,
  Kanit_700Bold,
  Kanit_800ExtraBold,
  Kanit_900Black,
} from '@expo-google-fonts/kanit';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider } from '@/providers/AuthProvider';
import { QueryClientProvider } from '@/providers/QueryClientProvider';

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    Kanit_100Thin,
    Kanit_200ExtraLight,
    Kanit_300Light,
    Kanit_400Regular,
    Kanit_500Medium,
    Kanit_600SemiBold,
    Kanit_700Bold,
    Kanit_800ExtraBold,
    Kanit_900Black,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

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

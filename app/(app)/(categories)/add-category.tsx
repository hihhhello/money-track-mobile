import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TextInput } from '@/shared/ui/TextInput';

export default function AddCategoryModal() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingTop: insets.top,
      }}
    >
      <TextInput placeholder="Category name" />

      <StatusBar style="light" />
    </View>
  );
}

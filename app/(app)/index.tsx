import { Button, Text, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';

export default function HomeScreen() {
  const { signOut } = useAuth();

  return (
    <View>
      <Text>Home Screen</Text>

      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

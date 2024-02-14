import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/providers/AuthProvider';

export default function SignIn() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  return (
    <View style={{ paddingTop: insets.top }}>
      <View>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) =>
            setCredentials((prevCredentials) => ({
              ...prevCredentials,
              email: value,
            }))
          }
          value={credentials.email}
          textContentType="emailAddress"
          autoComplete="email"
        />
      </View>

      <View>
        <Text>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={(value) =>
            setCredentials((prevCredentials) => ({
              ...prevCredentials,
              password: value,
            }))
          }
          value={credentials.password}
          textContentType="password"
          autoComplete="password"
        />
      </View>

      <Button
        title="Sign In"
        onPress={() => {
          signIn(credentials).then(() => {
            router.replace('/');
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

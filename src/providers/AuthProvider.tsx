import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Alert } from 'react-native';

type AuthContextType = {
  signIn: (credentials: { password: string; email: string }) => Promise<void>;
  signOut: () => void;
  session?: {
    user: {
      email: string;
      id: number;
    };
  } | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: () => {},
  isLoading: false,
  session: null,
});

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useAuth must be wrapped in a <AuthProvider />');
    }
  }

  return value;
};

export const AuthProvider = (props: PropsWithChildren) => {
  const [session, setSession] = useState<AuthContextType['session']>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    SecureStore.getItemAsync('session')
      .then((storeSession) => {
        if (!storeSession) {
          return;
        }

        setSession(JSON.parse(storeSession));

        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = useCallback(
    async (credentials: { password: string; email: string }) => {
      try {
        const res = await axios.post<{ access_token: string }>(
          `${process.env.EXPO_PUBLIC_SERVER_URL}/signin`,
          {
            password: credentials.password,
            email: credentials.email,
          },
        );

        if (res.status === 200 && res.data) {
          const userInfoResponse = await axios.get<{
            email: string;
            id: number;
          }>(`${process.env.EXPO_PUBLIC_SERVER_URL}/me`, {
            headers: {
              Authorization: `Bearer ${res.data.access_token}`,
            },
          });

          setSession({ user: userInfoResponse.data });
          await SecureStore.setItemAsync(
            'session',
            JSON.stringify({
              user: {
                ...userInfoResponse.data,
                accessToken: res.data.access_token,
              },
            }),
          );
        }
      } catch (err) {
        Alert.alert('Error', JSON.stringify(err));
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    setSession(null);
    await SecureStore.deleteItemAsync('session');
  }, []);

  const values: AuthContextType = useMemo(
    () => ({
      signIn,
      signOut,
      isLoading,
      session,
    }),
    [isLoading, session, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={values}>{props.children}</AuthContext.Provider>
  );
};

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const storeSession = await SecureStore.getItemAsync('session');

  const session = storeSession ? JSON.parse(storeSession) : null;

  console.log(session);

  if (session?.user?.accessToken) {
    config.headers.Authorization = `Bearer ${session?.user?.accessToken}`;
  }

  return config;
});

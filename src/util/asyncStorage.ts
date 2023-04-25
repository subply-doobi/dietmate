import AsyncStorage from '@react-native-async-storage/async-storage';

// asyncStorage ------------------------ //
export const storeToken = async (accessToken: string, refreshToken: string) => {
  await AsyncStorage.setItem('ACCESS_TOKEN', accessToken);
  await AsyncStorage.setItem('REFRESH_TOKEN', refreshToken);
};

export const getStoredToken = async () => {
  const accessToken = await AsyncStorage.getItem('ACCESS_TOKEN');
  const refreshToken = await AsyncStorage.getItem('REFRESH_TOKEN');
  return {
    accessToken,
    refreshToken,
  };
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('ACCESS_TOKEN');
    await AsyncStorage.removeItem('REFRESH_TOKEN');
  } catch (e) {
    console.log('wipeDoobiToken: ', e);
  }
};

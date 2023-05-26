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

export const checkTooltipShow = async (value: string) => {
  try {
    const notShowAgain = await AsyncStorage.getItem('NOT_SHOW_AGAIN');
    if (notShowAgain === null) {
      return true;
    } else {
      const notShowAgainList = JSON.parse(notShowAgain);
      if (notShowAgainList.includes(value)) {
        return false;
      } else {
        return true;
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateNotShowAgain = async (value: string) => {
  try {
    const notShowAgain = await AsyncStorage.getItem('NOT_SHOW_AGAIN');
    if (notShowAgain === null) {
      await AsyncStorage.setItem('NOT_SHOW_AGAIN', JSON.stringify([value]));
    } else {
      const notShowAgainList = JSON.parse(notShowAgain);
      notShowAgainList.push(value);
      await AsyncStorage.setItem(
        'NOT_SHOW_AGAIN',
        JSON.stringify(notShowAgainList),
      );
    }
  } catch (error) {
    console.error(error);
  }
};

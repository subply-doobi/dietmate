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
    console.log('removeToken: ', 'success');
  } catch (e) {
    console.log('wipeDoobiTokenFail: ', e);
  }
};

// 현재  [Hometooltip, onboarding]
export const checkNotShowAgain = async (value: string) => {
  try {
    const notShowAgain = await AsyncStorage.getItem('NOT_SHOW_AGAIN');
    if (notShowAgain === null) {
      return false;
    } else {
      const notShowAgainList = JSON.parse(notShowAgain);
      if (notShowAgainList.includes(value)) {
        return true;
      } else {
        return false;
      }
    }
  } catch (error) {
    console.error(error);
  }
};
export const resetGuide = async () => {
  try {
    await AsyncStorage.removeItem('NOT_SHOW_AGAIN');
  } catch (error) {
    console.error(error);
  }
};
export const updateNotShowAgain = async (value: string) => {
  try {
    const notShowAgain = await AsyncStorage.getItem('NOT_SHOW_AGAIN');
    // 해당 key에 처음 저장하는 경우
    if (notShowAgain === null) {
      await AsyncStorage.setItem('NOT_SHOW_AGAIN', JSON.stringify([value]));
      return;
    }
    const notShowAgainList = JSON.parse(notShowAgain);

    // 해당 key에 이미 value 값이 저장되어 있는 경우
    if (notShowAgainList.includes(value)) return;

    // 해당 key에 value값이 없는 경우
    notShowAgainList.push(value);
    await AsyncStorage.setItem(
      'NOT_SHOW_AGAIN',
      JSON.stringify(notShowAgainList),
    );
  } catch (error) {
    console.error(error);
  }
};

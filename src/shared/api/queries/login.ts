import {useMutation} from '@tanstack/react-query';
import {IQueryOptions} from '../types/common';
import {KakaoOAuthToken, login} from '@react-native-seoul/kakao-login';
import {getDoobiToken, getGuestToken} from './token';
import {storeToken} from '../../utils/asyncStorage';
import {useNavigation} from '@react-navigation/native';

export type ILoginType = 'kakao' | 'guest';

const loginMutation = async (type: ILoginType) => {
  console.log('loginMtion start');
  let accessToken = undefined;
  let refreshToken = undefined;

  // kakaoLogin
  if (type === 'kakao') {
    console.log('kakao login start');
    const kakaoToken: KakaoOAuthToken = await login();
    const kakaoAccessToken = kakaoToken?.accessToken;
    const res = await getDoobiToken(kakaoAccessToken);
    accessToken = res?.accessToken || undefined;
    refreshToken = res?.refreshToken || undefined;
  }

  // guestLogin
  if (type === 'guest') {
    const res = await getGuestToken();
    accessToken = res?.accessToken || undefined;
    refreshToken = res?.refreshToken || undefined;
  }

  accessToken && refreshToken && (await storeToken(accessToken, refreshToken));
  return accessToken;
};

export const useLoginByType = (options?: IQueryOptions) => {
  const navigation = useNavigation();
  const mutation = useMutation({
    mutationFn: ({type}: {type: ILoginType}) => loginMutation(type),
    onError: (error: Error) => {
      // console.log('useLoginByType error: error.name: ', error.name);
      // console.log('useLoginByType error: error.message: ', error.message);
      const isKakaoError = error.message === 'user cancelled.';
      if (isKakaoError) return;
      navigation.reset({
        index: 0,
        routes: [{name: 'ErrorPage', params: {errorCode: 404}}],
      });
    },
  });
  return mutation;
};

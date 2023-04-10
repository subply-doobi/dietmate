import AsyncStorage from '@react-native-async-storage/async-storage';
import {KakaoOAuthToken, login} from '@react-native-seoul/kakao-login';
import axios, {AxiosError} from 'axios';
import {storeToken} from '../../util/asyncStorage';
import {IGetAuthData} from '../types/member';
import {IReIssueTokenData} from '../types/token';
import {queryFn} from './requestFn';

import {GET_TOKEN, GET_AUTH, RE_ISSUE_TOKEN} from './urls';

export const getDoobiToken = async (kakaoAccessToken: string | null) => {
  try {
    const result = await axios.get(`${GET_TOKEN}/${kakaoAccessToken}`);
    return result?.status === 200 ? result.data : undefined;
  } catch (e) {
    console.log('getDoobiToken: ', e);
  }
};

export const kakaoLogin = async () => {
  const kakaoToken: KakaoOAuthToken = await login();
  const {accessToken, refreshToken} = await getDoobiToken(
    kakaoToken?.accessToken,
  );
  if (accessToken && refreshToken) await storeToken(accessToken, refreshToken);

  return accessToken;
};

export const validateToken = async () => {
  let isValidated = false;
  try {
    // 인증 여부 조회
    await queryFn<IGetAuthData>(GET_AUTH);
    isValidated = true;

    // 인증 오류 처리
  } catch (e) {
    if (!(e instanceof AxiosError)) return {isValidated};
    console.log('validateToken: auth 오류', e.response?.status);

    // 토큰 재발급 (401에러인 경우만 재발급 시도)
    if (e.response?.status !== 401) return {isValidated};
    try {
      const reIssue = await queryFn<IReIssueTokenData>(RE_ISSUE_TOKEN);
      await storeToken(reIssue.accessToken, reIssue.refreshToken);
      isValidated = true;

      // 토큰 재발급 오류
    } catch (e) {
      if (!(e instanceof AxiosError)) return {isValidated};
      console.log('validateToken: reIssue 오류: ', e.response?.status);
    }
  }
  console.log('validateToken: isValidated: ', isValidated);
  return {isValidated};
};

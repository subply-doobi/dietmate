import AsyncStorage from '@react-native-async-storage/async-storage';
import {KakaoOAuthToken, login} from '@react-native-seoul/kakao-login';
import axios, {AxiosError} from 'axios';
import {storeToken} from '../../util/asyncStorage';
import {IGetAuthData} from '../types/member';
import {IReIssueTokenData} from '../types/token';
import {queryFn} from './requestFn';

import {GET_TOKEN, GET_AUTH, RE_ISSUE_TOKEN, GET_GUEST} from './urls';
import {AXIOS_TIMEOUT} from '../../constants/constants';

const requestConfig = {
  timeout: AXIOS_TIMEOUT,
};

export const getDoobiToken = async (kakaoAccessToken: string | null) => {
  try {
    const result = await axios.get(
      `${GET_TOKEN}/${kakaoAccessToken}`,
      requestConfig,
    );
    return result?.status === 200 ? result.data : undefined;
  } catch (e) {
    console.log('getDoobiToken error: ', e);
  }
};
export const getGuestToken = async () => {
  try {
    const result = await axios.get(`${GET_GUEST}`, requestConfig);
    return result?.status === 200 ? result.data : undefined;
  } catch (e) {
    console.log('getGuestToken error: ', e);
  }
};
export const kakaoLogin = async () => {
  console.log('kakaoLogin start');
  try {
    const kakaoToken: KakaoOAuthToken = await login();
    const kakaoAccessToken = kakaoToken?.accessToken;

    const {accessToken, refreshToken} = await getDoobiToken(kakaoAccessToken);
    if (accessToken && refreshToken)
      await storeToken(accessToken, refreshToken);
    return accessToken;
  } catch (e) {
    console.log('kakaoLoginError: ', e);
  }
};
export const guestLogin = async () => {
  console.log('guestLogin start');
  try {
    const {accessToken, refreshToken} = await getGuestToken();
    if (accessToken && refreshToken)
      await storeToken(accessToken, refreshToken);
    return accessToken;
  } catch (e) {
    console.log('guestLogin error: ', e);
  }
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
      console.log(
        '----------------------  !! reIssue !! --------------------------',
      );

      // 토큰 재발급 오류
    } catch (e) {
      if (!(e instanceof AxiosError)) return {isValidated};
      console.log('validateToken: reIssue 오류: ', e.response?.status);
    }
  }
  console.log('validateToken: isValidated: ', isValidated);
  return {isValidated};
};

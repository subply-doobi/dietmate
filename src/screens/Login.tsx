// Description: 로그인 화면
//RN, 3rd
import React, {useEffect, useCallback} from 'react';
import styled from 'styled-components/native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import {kakaoLogin, validateToken} from '../query/queries/token';
import {IBaseLine} from '../query/types/baseLine';

// doobi util, redux, etc
import {checkNotShowAgain} from '../util/asyncStorage';

//react-query
import {useGetBaseLine} from '../query/queries/baseLine';

//doobi Component
import {BtnCTA, BtnText} from '../styles/StyledConsts';

//sentry
import * as Sentry from '@sentry/react-native';
import {has} from 'immer/dist/internal';
import {hasValidBreakpointFormat} from 'native-base/lib/typescript/theme/tools';

const navigateByUserInfo = async (
  data: IBaseLine | any,
  navigation: NavigationProp<ReactNavigation.RootParamList>,
) => {
  const hasBaseLine = Object.keys(data).length === 0 ? false : true;
  const canSkipOnboarding = await checkNotShowAgain('ONBOARDING');
  if (!canSkipOnboarding) {
    // canSkipOnboarding 아니면 가이드로
    navigation.navigate('Guide');
    return;
  }
  if (!hasBaseLine) {
    // canSkipOnboarding 있는데 baseline 없으면 FirstInput으로
    navigation.navigate('InputNav', {screen: 'FirstInput'});
    return;
  }

  // baseline 있으면 홈으로
  navigation.navigate('BottomTabNav', {screen: 'Home'});
};

const Login = () => {
  // navigation
  const navigation = useNavigation();
  // react-query
  const {data, refetch} = useGetBaseLine({enabled: false});
  // console.log('LOGIN/useGetBaseLine', data);
  const signInWithKakao = async (): Promise<void> => {
    await kakaoLogin();
    const refetchedData = await refetch().then(res => res.data);
    refetchedData && navigateByUserInfo(refetchedData, navigation);
  };
  // etc
  useEffect(() => {
    const checkUser = async () => {
      const {isValidated} = await validateToken();
      if (!isValidated) return;
      const refetchedData = await refetch().then(res => res.data);
      refetchedData && navigateByUserInfo(refetchedData, navigation);
    };

    checkUser();
  }, []);

  return (
    <Container>
      <Box>
        <TitleText>{'식단조절은\n두비에게'}</TitleText>
        <BtnKakaoLogin btnStyle="kakao" onPress={signInWithKakao}>
          <BtnTextKakao>카카오 로그인</BtnTextKakao>
        </BtnKakaoLogin>
      </Box>
    </Container>
  );
};

export default Login;

const Container = styled.View`
  flex: 1;
  padding: 0px 16px 0px 16px;
`;

const Box = styled.View`
  width: 100%;
  position: absolute;
  bottom: 70px;
  align-self: center;
`;

const TitleText = styled.Text`
  margin-bottom: 70px;
  color: ${colors.textMain};
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  line-height: 35px;
  text-align: center;
`;

const BtnKakaoLogin = styled(BtnCTA)`
  align-self: center;
`;

const BtnTextKakao = styled(BtnText)`
  color: ${colors.textMain};
`;

// Description: 로그인 화면
//RN, 3rd
import React, {useEffect, useCallback} from 'react';
import styled from 'styled-components/native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import {kakaoLogin, validateToken, guestLogin} from '../query/queries/token';
import {IBaseLine} from '../query/types/baseLine';

// doobi util, redux, etc
import {checkNotShowAgain} from '../util/asyncStorage';

//react-query
import {useGetBaseLine} from '../query/queries/baseLine';
//doobi Component
import {BtnCTA, BtnText} from '../styles/StyledConsts';
const navigateByUserInfo = async (
  data: IBaseLine | any,
  navigation: NavigationProp<any>,
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
  navigation.reset({
    index: 0,
    routes: [{name: 'BottomTabNav', params: {screen: 'Home'}}],
  });
};

const Login = () => {
  // navigation
  const navigation = useNavigation();
  // react-query
  const {refetch} = useGetBaseLine({enabled: false});

  // kakaoLogin
  const signInWithKakao = async (): Promise<void> => {
    const KLdata = await kakaoLogin();
    if (KLdata === undefined) return;
    const baseLineData = await refetch().then(res => res.data);
    baseLineData && navigateByUserInfo(baseLineData, navigation);
  };

  //guest login
  const signInWithGuest = async (): Promise<void> => {
    const GLdata = await guestLogin();
    if (GLdata === undefined) return;
    const baseLineData = await refetch().then(res => res.data);
    baseLineData && navigateByUserInfo(baseLineData, navigation);
  };

  useEffect(() => {
    const checkUser = async () => {
      const {isValidated} = await validateToken();
      if (!isValidated) return;
      const baseLineData = await refetch().then(res => res.data);
      baseLineData && navigateByUserInfo(baseLineData, navigation);
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
        <BtnGuestLogin onPress={signInWithGuest}>
          <BtnTextGuest>GUEST LOGIN</BtnTextGuest>
        </BtnGuestLogin>
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
const BtnGuestLogin = styled(BtnCTA)`
  align-self: center;
  margin-top: 20px;
`;

const BtnTextKakao = styled(BtnText)`
  color: ${colors.textMain};
`;
const BtnTextGuest = styled(BtnText)`
  color: ${colors.textMain};
`;

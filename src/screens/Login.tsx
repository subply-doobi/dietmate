// Description: 로그인 화면
//RN, 3rd
import React, {useEffect, useCallback} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
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

const navigateByBaseLine = (data: IBaseLine | any, navigation) => {
  // check user 회원가입 여부
  const hasBaseLine = Object.keys(data).length === 0 ? false : true;
  if (hasBaseLine) {
    navigation.reset({
      index: 0,
      routes: [{name: 'BottomTabNav', params: {screen: 'Home'}}],
    });
  } else {
    navigation.navigate('InputNav', {screen: 'FirstInput'});
  }
};

const Login = () => {
  // navigation
  const navigation = useNavigation();

  // react-query
  const {data, refetch} = useGetBaseLine({enabled: false});
  const signInWithKakao = async (): Promise<void> => {
    await kakaoLogin();
    const refetchedData = await refetch();
    refetchedData && navigateByBaseLine(refetchedData, navigation);
    navigation.navigate('BottomTabNav', {screen: 'Home'});
  };
  // capture errors
  try {
    signInWithKakao();
  } catch (err) {
    Sentry.captureException(err);
  }
  // etc
  useEffect(() => {
    // 가이드 보여줄지 결정
    const initializeGuide = async () => {
      const notShowAgain = await checkNotShowAgain('ONBOARDING');
      notShowAgain || navigation.navigate('Guide');
    };
    const useCheckUser = async () => {
      const {isValidated} = await validateToken();
      if (!isValidated) return;
      const refetchedData = await refetch().then(res => res.data);
      refetchedData && navigateByBaseLine(refetchedData, navigation);
    };

    initializeGuide();
    useCheckUser();
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

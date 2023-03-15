import styled from 'styled-components/native';
import {BtnCTA, BtnText} from '../styles/styledConsts';
import colors from '../styles/colors';
import {NavigationProps} from '../constants/constants';
import React, {useEffect, useCallback} from 'react';
import {useGetBaseLine} from '../query/queries/baseLine';
import {validateToken} from '../query/queries/token';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../stores/store';
import {useNavigation} from '@react-navigation/native';

const Login = () => {
  const navigation = useNavigation();
  const {navigate, reset} = navigation;

  //redux
  //유저값 check 후 화면 이동
  const {data, isLoading} = useGetBaseLine();
  const signInWithKakao = async (): Promise<void> => {
    const isTokenValid = await validateToken();
    isTokenValid && !isLoading
      ? data && data.constructor === Object && Object.keys(data).length === 0
        ? navigate('InputNav', {screen: 'FirstInput'})
        : reset({
            index: 0,
            routes: [
              {
                name: 'BottomTabNav',
                params: {
                  screen: 'Home',
                },
              },
            ],
          })
      : navigate('Login', {screen: 'Login'});
  };
  useEffect(() => {
    signInWithKakao();
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

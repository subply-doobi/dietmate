// Description: 로그인 화면
// RN, 3rd
import {useEffect} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import colors from '../styles/colors';
import {kakaoLogin, validateToken, guestLogin} from '../query/queries/token';
import AppleLogin from '../components/login/appleLogin';

// doobi util, redux, etc
import {navigateByUserInfo} from '../util/login/navigateByUserInfo';

// react-query
import {useGetBaseLine} from '../query/queries/baseLine';

// doobi Component
import {BtnCTA, BtnText} from '../styles/styledConsts';
import {IS_IOS} from '../constants/constants';

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

  // guest login
  // const signInWithGuest = async (): Promise<void> => {
  //   const GLdata = await guestLogin();
  //   if (GLdata === undefined) return;
  //   const baseLineData = await refetch().then(res => res.data);
  //   baseLineData && navigateByUserInfo(baseLineData, navigation);
  // };

  // useeffect
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
        {/* <BtnGuestLogin onPress={signInWithGuest}>
          <BtnTextGuest>GUEST LOGIN</BtnTextGuest>
        </BtnGuestLogin> */}
        {IS_IOS ? <AppleLogin /> : <></>}
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

// const BtnGuestLogin = styled(BtnCTA)`
//   align-self: center;
//   margin-top: 20px;
// `;

// const BtnTextGuest = styled(BtnText)`
//   color: ${colors.textMain};
// `;

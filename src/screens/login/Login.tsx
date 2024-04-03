// Description: 로그인 화면
// RN, 3rd
import {useEffect} from 'react';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import colors from '../../shared/colors';
import {
  kakaoLogin,
  validateToken,
  guestLogin,
} from '../../shared/api/queries/token';
import AppleLogin from './ui/AppleLogin';

// doobi util, redux, etc
import {navigateByUserInfo} from './util/navigateByUserInfo';
import {useGetGuestYn} from '../../shared/api/queries/guest';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {
  getNotShowAgainList,
  initializeNotShowAgainList,
  updateNotShowAgainList,
} from '../../shared/utils/asyncStorage';

// doobi Component
import {BtnCTA, BtnText, TextMain} from '../../shared/ui/styledComps';
import {IS_IOS} from '../../shared/constants';

const login: {[key: string]: Function} = {
  kakao: kakaoLogin,
  guest: guestLogin,
};

const Login = () => {
  // navigation
  const navigation = useNavigation();

  // react-query
  const {data: guestYnData} = useGetGuestYn();
  const {refetch} = useGetBaseLine({enabled: false});

  // kakaoLogin || guest login (플레이스토어, 앱스토어, 카드사 심사용: 서버 값으로 사용유무 결정)
  const signIn = async (option: string): Promise<void> => {
    let loginData = await login[option]();
    if (loginData === undefined) return;
    const baseLineData = await refetch().then(res => res.data);
    baseLineData && navigateByUserInfo(baseLineData, navigation);
  };

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
        <Logo
          source={require('../../shared/assets/appIcon/appIcon_black.png')}
        />
        <TitleText>다이어트메이트</TitleText>
        <BtnKakaoLogin btnStyle="kakao" onPress={() => signIn('kakao')}>
          <BtnTextKakao>카카오 로그인</BtnTextKakao>
        </BtnKakaoLogin>

        {/* 앱심사용 게스트로그인 사용유무 */}
        {guestYnData && guestYnData.enableYn === 'Y' && (
          <BtnGuestLogin onPress={() => signIn('guest')}>
            <BtnTextGuest>GUEST LOGIN</BtnTextGuest>
          </BtnGuestLogin>
        )}

        {IS_IOS && guestYnData && guestYnData.enableYn === 'Y' && (
          <AppleLogin />
        )}
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

const TitleText = styled(TextMain)`
  margin-top: 24px;
  margin-bottom: 80px;
  font-size: 32px;
  text-align: center;
  line-height: 32px;
  font-family: 'KotraHope';
  include-font-padding: false;
`;

const Logo = styled.Image`
  width: 100px;
  height: 100px;
  align-self: center;
  background-color: ${colors.inactivated};
  border-radius: 40px;
`;

const BtnKakaoLogin = styled(BtnCTA)`
  align-self: center;
`;

const BtnTextKakao = styled(BtnText)`
  color: ${colors.textMain};
`;

const BtnGuestLogin = styled(BtnCTA)`
  align-self: center;
  margin-top: 20px;
`;

const BtnTextGuest = styled(BtnText)`
  color: ${colors.textMain};
`;

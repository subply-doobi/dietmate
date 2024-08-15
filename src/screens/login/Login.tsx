// RN
import {useEffect, useState} from 'react';

// 3rd
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

// doobi
import {navigateByUserInfo} from '../../shared/utils/navigateByUserInfo';
import {useGetGuestYn} from '../../shared/api/queries/guest';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import colors from '../../shared/colors';
import {validateToken} from '../../shared/api/queries/token';
import {ILoginType, useLoginByType} from '../../shared/api/queries/login';
import {IS_IOS} from '../../shared/constants';
import AppleLogin from './ui/AppleLogin';
import {BtnCTA, BtnText, TextMain} from '../../shared/ui/styledComps';

const Login = () => {
  // navigation
  const navigation = useNavigation();

  // react-query
  const {data: guestYnData} = useGetGuestYn();
  const {data: baseLineData, refetch: refetchBaseLine} = useGetBaseLine({
    enabled: false,
  });
  const loginByTypeMutation = useLoginByType();

  // kakaoLogin || guest login (플레이스토어, 앱스토어, 카드사 심사용: 서버 값으로 사용유무 결정)
  const signIn = async (option: ILoginType): Promise<void> => {
    const res = await loginByTypeMutation.mutateAsync({type: option});
    if (!res) return;
    if (baseLineData) {
      baseLineData && navigateByUserInfo(baseLineData, navigation);
      return;
    }
    const newBLData = await refetchBaseLine().then(res => res.data);
    navigateByUserInfo(newBLData, navigation);
  };

  // useEffect
  // 자동로그인
  useEffect(() => {
    const checkUser = async () => {
      const {isValidated} = await validateToken();
      if (!isValidated) return;
      const baseLineData = await refetchBaseLine().then(res => res.data);
      baseLineData && navigateByUserInfo(baseLineData, navigation);
    };
    checkUser();
  }, []);

  return (
    <Container>
      <Box>
        <LogoBox>
          <Logo
            resizeMode="contain"
            source={require('../../shared/assets/appIcon/appIcon_black.png')}
          />
        </LogoBox>
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

const LogoBox = styled.View`
  width: 80px;
  height: 80px;
  align-self: center;
  justify-content: center;
  align-items: center;
  background-color: ${colors.inactivated};
  border-radius: 30px;
`;

const Logo = styled.Image`
  width: 60px;
  height: 60px;
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

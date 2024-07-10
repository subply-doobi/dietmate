// RN
import {useEffect, useState} from 'react';

// 3rd
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

// doobi
import {navigateByUserInfo} from './util/navigateByUserInfo';
import {useGetGuestYn} from '../../shared/api/queries/guest';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {version as appVersion} from '../../../package.json';
import colors from '../../shared/colors';
import {validateToken} from '../../shared/api/queries/token';
import {ILoginType, useLoginByType} from '../../shared/api/queries/login';
import {link} from '../../shared/utils/linking';
import {useGetLatestVersion} from '../../shared/api/queries/version';
import {
  APP_STORE_URL,
  IS_ANDROID,
  IS_IOS,
  PLAY_STORE_URL,
} from '../../shared/constants';

import AppleLogin from './ui/AppleLogin';
import {BtnCTA, BtnText, TextMain} from '../../shared/ui/styledComps';
import DAlert from '../../shared/ui/DAlert';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';

const Login = () => {
  // useState
  const [isUpdateNeeded, setIsUpdateNeeded] = useState(false);

  // navigation
  const navigation = useNavigation();

  // react-query
  const {data: guestYnData} = useGetGuestYn();
  const {refetch: refetchBaseLine} = useGetBaseLine({enabled: false});
  const {refetch: refetchLatestVersion} = useGetLatestVersion({enabled: false});
  const loginByTypeMutation = useLoginByType();

  // kakaoLogin || guest login (플레이스토어, 앱스토어, 카드사 심사용: 서버 값으로 사용유무 결정)
  const signIn = async (option: ILoginType): Promise<void> => {
    const res = await loginByTypeMutation.mutateAsync({type: option});
    if (!res) return;
    const baseLineData = await refetchBaseLine().then(res => res.data);
    baseLineData && navigateByUserInfo(baseLineData, navigation);
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

  // 앱 업데이트 확인
  useEffect(() => {
    const checkVersion = async () => {
      const latestVersion = (await refetchLatestVersion()).data;
      console.log('Login: latestVersion: ', latestVersion);
      if (!latestVersion) return;
      appVersion !== latestVersion && setIsUpdateNeeded(true);
    };
    checkVersion();
  }, []);

  // etc
  const visitStore = () => {
    IS_ANDROID ? link(PLAY_STORE_URL) : link(APP_STORE_URL);
    setIsUpdateNeeded(false);
  };

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

      {/* 앱 버전 확인 알럿 */}
      <DAlert
        alertShow={isUpdateNeeded}
        onConfirm={() => visitStore()}
        onCancel={() => setIsUpdateNeeded(false)}
        NoOfBtn={2}
        confirmLabel="업데이트"
        renderContent={() => (
          <CommonAlertContent text="앱 업데이트가 필요합니다" />
        )}
      />
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

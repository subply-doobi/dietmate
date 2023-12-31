// react, RN, 3rd
import {useState} from 'react';
import styled from 'styled-components/native';
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Lottie from 'lottie-react-native';

// doobi util, redux, etc
import colors from '../styles/colors';
import {icons} from '../assets/icons/iconSource';
import {
  IS_ANDROID,
  KOREAN_NUTRITION_REFERENCE_URL,
  SCREENWIDTH,
} from '../constants/constants';

// doobi Component
import {BtnCTA, Row, Col, StyledProps} from '../styles/styledConsts';
import {updateNotShowAgain} from '../util/asyncStorage';
import {Pressable} from 'react-native';
import {link} from '../util/common/linking';

interface IGuidePage {
  step: number;
  text: React.ReactElement | string;
  subText?: React.ReactElement | string;
  onboardingSource?: any;
  stepImage: any;
  onboardingSourceType: 'none' | 'img' | 'lottie';
}
const renderGuideContents = (step: number, guidePageArray: IGuidePage[]) => {
  return (
    <Col>
      <Row style={{justifyContent: 'space-between', alignItems: 'flex-start'}}>
        {guidePageArray[step - 1].text}
        <StepImage source={guidePageArray[step - 1].stepImage} />
      </Row>
      {guidePageArray[step - 1].subText && guidePageArray[step - 1].subText}
    </Col>
  );
};

const Guide = () => {
  // navigation
  const {reset} = useNavigation();
  const {params} = useRoute();

  // useState
  const [step, setStep] = useState(1);

  // etc
  const guidePageArray: IGuidePage[] = [
    {
      step: 1,
      text: (
        <GuideHeaderText>
          간편식 <GuideHeaderTextBold>개인맞춤식단</GuideHeaderTextBold>
          {'\n'}두비가 도와줄게요
        </GuideHeaderText>
      ),
      stepImage: icons.guideCheckbox_32,
      onboardingSourceType: 'lottie',
      onboardingSource: require('../assets/onboardingLottie/onboardingCr.json'),
    },
    {
      step: 2,
      text: (
        <GuideHeaderText>
          <GuideHeaderTextBold>기본 정보를 입력해</GuideHeaderTextBold>
          {'\n'}목표섭취량을 구해요
        </GuideHeaderText>
      ),
      subText: (
        <>
          <GuideHeaderSubText>
            초보자는 저희에게 계산을 맡겨주세요
          </GuideHeaderSubText>
          <GuideHeaderSubText
            style={{
              marginTop: 0,
              fontStyle: 'italic',
              color: colors.blue,
              textDecorationLine: 'underline',
            }}
            onPress={() => link(KOREAN_NUTRITION_REFERENCE_URL)}>
            (보건복지부 한국인 영양소 섭취기준, 2020)
          </GuideHeaderSubText>
          <GuideHeaderSubText style={{marginTop: 0}}>
            을 기반으로 목표영양을 구해드려요
          </GuideHeaderSubText>
          <GuideHeaderSubText>
            <GuideHeaderSubTextBold>마이페이지</GuideHeaderSubTextBold>에서
            목표섭취량을 스스로 변경할 수도 있어요
          </GuideHeaderSubText>
        </>
      ),
      stepImage: icons.guide1_32,
      onboardingSourceType: 'img',
      onboardingSource: require('../assets/onboardingImg/onboarding1.png'),
    },
    {
      step: 3,
      text: (
        <GuideHeaderText>
          직접 끼니구성이 귀찮다면{'\n'}
          <GuideHeaderTextBold>장바구니</GuideHeaderTextBold> 에서{' '}
          <GuideHeaderTextBold>[자동구성]</GuideHeaderTextBold>
        </GuideHeaderText>
      ),
      subText: (
        <GuideHeaderSubText>
          처음 사용하시는 분들은{' '}
          <GuideHeaderSubTextBold>장바구니</GuideHeaderSubTextBold>를 먼저
          가보세요{'\n'}
          <GuideHeaderSubTextBold>자동구성</GuideHeaderSubTextBold>은 바로{' '}
          <GuideHeaderSubTextBold>
            내 목표에 맞는 식품조합
          </GuideHeaderSubTextBold>
          을 보여줘요
        </GuideHeaderSubText>
      ),
      stepImage: icons.guide2_32,
      onboardingSourceType: IS_ANDROID ? 'lottie' : 'img',
      onboardingSource: IS_ANDROID
        ? require('../assets/onboardingLottie/autoMenu1.json')
        : require('../assets/onboardingImg/autoMenu1.png'),
    },
    {
      step: 4,
      text: (
        <GuideHeaderText>
          직접 끼니구성이 귀찮다면{'\n'}
          <GuideHeaderTextBold>장바구니</GuideHeaderTextBold> 에서{' '}
          <GuideHeaderTextBold>[자동구성]</GuideHeaderTextBold>
        </GuideHeaderText>
      ),
      subText: (
        <GuideHeaderSubText>
          <GuideHeaderSubTextBold>원하는 식품과 함께 </GuideHeaderSubTextBold>
          자동구성도 가능하지만{'\n'}
          식품을 많이 추가해놓으면 자동구성 확률이 낮아져요
        </GuideHeaderSubText>
      ),
      stepImage: icons.guide3_32,
      onboardingSourceType: IS_ANDROID ? 'lottie' : 'img',
      onboardingSource: IS_ANDROID
        ? require('../assets/onboardingLottie/autoMenu2.json')
        : require('../assets/onboardingImg/autoMenu2.png'),
    },
    {
      step: 5,
      text: (
        <GuideHeaderText>
          원하는 식품을 추가하면서{'\n'}
          <GuideHeaderTextBold>그래프로 영양을 확인</GuideHeaderTextBold> 해요
        </GuideHeaderText>
      ),
      subText: (
        <GuideHeaderSubText>
          식품을 추가하려면
          <GuideHeaderSubTextBold> 영양성분 박스</GuideHeaderSubTextBold>를
          클릭하거나 {'\n'}
          <GuideHeaderSubTextBold>왼쪽으로 스와이프</GuideHeaderSubTextBold>
          하시면 됩니다
        </GuideHeaderSubText>
      ),
      stepImage: icons.guide4_32,
      onboardingSourceType: IS_ANDROID ? 'lottie' : 'img',
      onboardingSource: IS_ANDROID
        ? require('../assets/onboardingLottie/manualAddDelete.json')
        : require('../assets/onboardingImg/manualAddDelete.png'),
    },
    {
      step: 6,
      text: (
        <GuideHeaderText>
          <GuideHeaderTextBold>빨간글씨</GuideHeaderTextBold>는 추가하면{'\n'}
          <GuideHeaderTextBold>목표를 초과</GuideHeaderTextBold>한다는 뜻이에요
        </GuideHeaderText>
      ),
      subText: (
        <GuideHeaderSubText>
          식품을 추가하려면
          <GuideHeaderSubTextBold> 영양성분 박스</GuideHeaderSubTextBold>를
          클릭하거나 {'\n'}
          <GuideHeaderSubTextBold>왼쪽으로 스와이프</GuideHeaderSubTextBold>
          하시면 됩니다
        </GuideHeaderSubText>
      ),
      stepImage: icons.guide5_32,
      onboardingSourceType: 'img',
      onboardingSource: require('../assets/onboardingImg/onboarding5.png'),
    },
    {
      step: 7,
      text: (
        <GuideHeaderText>
          <GuideHeaderTextBold>남은영양 이하 필터</GuideHeaderTextBold>를 사용해
          {'\n'}더 쉽게 목표영양을 채워요
        </GuideHeaderText>
      ),
      subText: (
        <GuideHeaderSubText>
          버튼을 누를 때마다 현재 끼니 기준으로{'\n'}
          <GuideHeaderSubTextBold>
            남아있는 영양 이하인 식품들만 보여줘요
          </GuideHeaderSubTextBold>
        </GuideHeaderSubText>
      ),
      stepImage: icons.guide6_32,
      onboardingSourceType: IS_ANDROID ? 'lottie' : 'img',
      onboardingSource: IS_ANDROID
        ? require('../assets/onboardingLottie/remainNutrFilter.json')
        : require('../assets/onboardingImg/remainNutrFilter.png'),
    },
  ];

  // onPressFn
  const finishGuide = () => {
    // step 1로 초기화 후 홈페이지 or 원래 보던 페이지로 이동
    setStep(1);
    // 온보딩 다시 보지 않기로 설정
    updateNotShowAgain('ONBOARDING');
    // Mypage에서 가이드 화면 온 경우 다시 Mypage로 이동
    // or login 화면으로 이동
    if (params?.from === 'Mypage') {
      reset({
        index: 0,
        routes: [
          {name: 'BottomTabNav', params: {screen: 'Home'}},
          {name: 'BottomTabNav', params: {screen: 'Mypage'}},
        ],
      });
      return;
    }
    reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <Container>
      <Row style={{columnGap: 4}}>
        {guidePageArray.map(e => (
          <StatusBar key={e.step} isActivated={e.step <= step} />
        ))}
      </Row>
      {renderGuideContents(step, guidePageArray)}

      {/* contents */}
      <Col style={{flex: 1, marginTop: 20, marginBottom: 20}}>
        {guidePageArray[step - 1].onboardingSourceType === 'lottie' ? (
          <Lottie
            source={guidePageArray[step - 1].onboardingSource}
            autoPlay
            loop
          />
        ) : (
          guidePageArray[step - 1].onboardingSourceType === 'img' && (
            <ContentImage
              source={guidePageArray[step - 1].onboardingSource}
              resizeMode="contain"
            />
          )
        )}
      </Col>

      <BottomRow>
        <BtnCTA
          style={{
            flex: 1,
          }}
          btnStyle={'border'}
          onPress={() => finishGuide()}>
          <BottomText style={{color: colors.textSub}}>건너뛰기</BottomText>
        </BtnCTA>

        <BtnCTA
          style={{
            flex: 1,
          }}
          btnStyle={'activated'}
          onPress={() => {
            if (step === guidePageArray.length) finishGuide();
            setStep(step + 1);
          }}>
          <BottomText>다음</BottomText>
        </BtnCTA>
      </BottomRow>
    </Container>
  );
};
export default Guide;

const Container = styled.SafeAreaView`
  flex: 1;
  margin: 16px;
`;
const StepImage = styled.Image`
  width: 32px;
  height: 32px;
`;

const GuideHeaderText = styled.Text`
  font-size: 24px;
  color: ${colors.textMain};
`;
const GuideHeaderTextBold = styled.Text`
  font-size: 24px;
  color: ${colors.textMain};
  font-weight: bold;
`;

const GuideHeaderSubText = styled.Text`
  font-size: 14px;
  color: ${colors.textMain};
  margin-top: 16px;
  line-height: 22px;
`;
const GuideHeaderSubTextBold = styled.Text`
  font-size: 14px;
  color: ${colors.textMain};
  font-weight: bold;
`;

const StatusBar = styled.View`
  background-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.main : colors.inactivated};
  height: 4px;
  width: ${(SCREENWIDTH - 32 - 4 * 6) / 7}px;
  border-radius: 2px;
  margin-top: 24px;
  margin-bottom: 40px;
`;

const ContentImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const BottomRow = styled.View`
  align-self: center;
  bottom: 8px;
  flex-direction: row;
  justify-content: space-between;
  column-gap: 8px;
`;

const BottomText = styled.Text`
  font-size: 16px;
  color: ${colors.white};
`;

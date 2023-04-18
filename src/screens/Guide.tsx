//RN, 3rd
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

import colors from '../styles/colors';
import {icons} from '../assets/icons/iconSource';
import {BtnCTA, Container, Row, Col} from '../styles/StyledConsts';
import {SCREENWIDTH} from '../constants/constants';
import {useState} from 'react';

const GuideContents1 = () => {
  return (
    <Row style={{justifyContent: 'space-between'}}>
      <GuideHeaderText>
        간편식 개인맞춤식단 {'\n'}
        두비가 도와줄게요
      </GuideHeaderText>
      <Image source={icons.guideCheckbox_32} />
    </Row>
  );
};
const GuideContents2 = () => {
  return (
    <>
      <Row style={{justifyContent: 'space-between'}}>
        <GuideHeaderText>
          기본 정보를 입력해 {'\n'}
          목표섭취량을 구해요
        </GuideHeaderText>
        <Image source={icons.guide1_32} />
      </Row>
      <GuideHeaderSubText>
        목표섭취량은 직접 설정할 수도 있어요
      </GuideHeaderSubText>
    </>
  );
};
const GuideContents3 = () => {
  return (
    <Row style={{justifyContent: 'space-between'}}>
      <GuideHeaderText>
        직접 끼니구성이 귀찮다면 {'\n'}
        장바구니에서 [자동구성]
      </GuideHeaderText>
      <Image source={icons.guide2_32} />
    </Row>
  );
};
const GuideContents4 = () => {
  return (
    <Row style={{justifyContent: 'space-between'}}>
      <GuideHeaderText>
        직접 끼니구성이 귀찮다면 {'\n'}
        장바구니에서 [자동구성]{' '}
      </GuideHeaderText>
      <Image source={icons.guide3_32} />
    </Row>
  );
};
const GuideContents5 = () => {
  return (
    <Row style={{justifyContent: 'space-between'}}>
      <GuideHeaderText>
        원하는 식품을 추가하면서 {'\n'}
        그래프로 영양을 확인해요
      </GuideHeaderText>
      <Image source={icons.guide4_32} />
    </Row>
  );
};
const GuideContents6 = () => {
  return (
    <Row style={{justifyContent: 'space-between'}}>
      <GuideHeaderText>
        빨간글씨는 추가하면 {'\n'}
        목표를 초과한다는 뜻이예요
      </GuideHeaderText>
      <Image source={icons.guide5_32} />
    </Row>
  );
};
const GuideContents7 = () => {
  return (
    <Row style={{justifyContent: 'space-between'}}>
      <GuideHeaderText>
        남은영양 이하 필터를 사용해 {'\n'}더 쉽게 목표 영양을 채워요{' '}
      </GuideHeaderText>
      <Image source={icons.guide6_32} />
    </Row>
  );
};

const guideContentsArray = [
  GuideContents1,
  GuideContents2,
  GuideContents3,
  GuideContents4,
  GuideContents5,
  GuideContents6,
  GuideContents7,
];
const statusBarArray = [1, 2, 3, 4, 5, 6];
const Guide = () => {
  const [step, setStep] = useState(0);
  return (
    <Container>
      <Row style={{columnGap: 3}}>
        {statusBarArray.map((e, index) => {
          return step > index ? (
            <Col key={index}>
              <ActivatedStatusBar key={index} />
            </Col>
          ) : (
            <Col key={index}>
              <StatusBar key={index} />
            </Col>
          );
        })}
      </Row>
      {guideContentsArray[step]()}
      <BottomRow>
        <BtnCTA
          style={{
            flex: 1,
          }}
          btnStyle={'border'}
          onPress={() => {
            console.log('건너뛰기');
          }}>
          <BottomText style={{color: colors.textSub}}>건너뛰기</BottomText>
        </BtnCTA>

        <BtnCTA
          style={{
            flex: 1,
            marginLeft: 8,
          }}
          btnStyle={'activated'}
          onPress={() => {
            setStep(step + 1);
          }}>
          <BottomText>다음</BottomText>
        </BtnCTA>
      </BottomRow>
    </Container>
  );
};
export default Guide;

const GuideHeaderText = styled.Text`
  font-size: 24px;
  color: ${colors.textMain};
`;
const GuideHeaderSubText = styled.Text`
  font-size: 14px;
  color: ${colors.textMain};
`;
const BottomRow = styled.View`
  position: absolute;
  bottom: 20px;
  left: 20px;
  flex-direction: row;
  justify-content: space-between;
`;

const BottomText = styled.Text`
  font-size: 16px;
  color: ${colors.white};
`;
const StatusBar = styled.View`
  background-color: ${colors.inactivated};
  height: 4px;
  width: ${(SCREENWIDTH - 32 - 4 * 5) / 6}px;
  border-radius: 2px;
  margin-top: 24px;
  margin-bottom: 24px;
`;
const ActivatedStatusBar = styled.View`
  background-color: ${colors.main};
  height: 4px;
  width: ${(SCREENWIDTH - 32 - 4 * 5) / 6}px;
  border-radius: 2px;
  margin-top: 24px;
  margin-bottom: 24px;
`;

const Image = styled.Image`
  margin-top: -24px;
  width: 32px;
  height: 32px;
`;

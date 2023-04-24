//RN, 3rd
import styled from 'styled-components/native';

import colors from '../styles/colors';
import {icons} from '../assets/icons/iconSource';
import {BtnCTA, Container, Row, Col} from '../styles/StyledConsts';
import {SCREENWIDTH} from '../constants/constants';
import {useState} from 'react';

interface IGuidePage {
  title: string;
  text: string;
  subText?: string;
  guideImage?: any;
  stepImage: any;
}

const guidePageArray: IGuidePage[] = [
  {
    title: '1',
    text: `간편식 개인맞춤 식단${'\n'}두비가 도와줄게요`,
    stepImage: icons.guideCheckbox_32,
  },
  {
    title: '2',
    text: `기본 정보를 입력해 ${'\n'}목표섭취량을 구해요`,
    subText: '목표섭취량은 직접 설정할 수도 있어요',
    stepImage: icons.guide1_32,
  },
  {
    title: '3',
    text: `직접 끼니구성이 귀찮다면 ${'\n'}장바구니에서 [자동구성]`,
    subText: `처음 사용하시는 분들도 장바구니를 먼저 가보세요 ${'\n'}자동구성은 바로 내 목표에 맞는 식품조합을 보여줘요`,
    stepImage: icons.guide2_32,
  },
  {
    title: '4',
    text: `직접 끼니구성이 귀찮다면 ${'\n'}장바구니에서 [자동구성]`,
    subText: `원하는 식품과 함께 자동구성도 가능해요 ${'\n'}식품을 많이 추가해 놓으면 자동구성 확률이 낮아져요 ㅠㅠ`,
    stepImage: icons.guide3_32,
  },
  {
    title: '5',
    text: `원하는 식품을 추가하면서  ${'\n'}그래프로 영양을 확인해요`,
    subText: `식품을 추가하려면 영양성분 박스를 클릭하거나 ${'\n'}왼쪽으로 스와이프 하시면 됩니다`,
    stepImage: icons.guide4_32,
  },
  {
    title: '6',
    text: `빨간글씨는 추가하면 ${'\n'}목표를 초과한다는 뜻이예요`,
    stepImage: icons.guide5_32,
  },
  {
    title: '7',
    text: `남은영양 이하 필터를 사용해 ${'\n'}더 쉽게 목표 영양을 채워요`,
    stepImage: icons.guide6_32,
  },
];
const renderGuideContents = (e: number) => {
  return (
    <Col>
      <Row style={{justifyContent: 'space-between'}}>
        <GuideHeaderText>{guidePageArray[e].text}</GuideHeaderText>
        <Image source={guidePageArray[e].stepImage} />
      </Row>
      {guidePageArray[e].subText ? (
        <GuideHeaderSubText>{guidePageArray[e].subText}</GuideHeaderSubText>
      ) : (
        <></>
      )}
      {guidePageArray[e].guideImage ? (
        <Image source={guidePageArray[e].guideImage} />
      ) : (
        <></>
      )}
    </Col>
  );
};

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
      {renderGuideContents(step)}

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

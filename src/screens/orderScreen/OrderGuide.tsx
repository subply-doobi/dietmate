import styled from 'styled-components/native';
import {Container, TextMain} from '../../styles/styledConsts';
import {SCREENWIDTH} from '../../constants/constants';

const OrderGuide = () => {
  return (
    <Container>
      <SubTitle>각 식품을 해당 쇼핑몰마다 찾아 구매하기가 어렵다면</SubTitle>
      <Title>끼니별 재포장 배송</Title>
      <ExampleImage
        source={require('../../assets/img/OrderGuideImg.png')}
        resizeMode="contain"
      />
      <GuideText style={{marginTop: 64}}>
        두비가 알아서 여러 식품사의 식품들을 {'\n'}
        <GuideTextBold>끼니별로 재포장</GuideTextBold>하여 배송해드립니다.
      </GuideText>
      <GuideText>
        식품가격이 최저가는 아닙니다.{'\n'}
        빨리 많은 분들께 즐겁고 간편한 식단을 제공해{'\n'}
        점차 가격을 낮출게요!
      </GuideText>
    </Container>
  );
};

export default OrderGuide;

const SubTitle = styled(TextMain)`
  align-self: center;

  font-size: 12px;
  font-weight: normal;

  margin-top: 64px;
`;
const Title = styled(TextMain)`
  align-self: center;

  font-size: 24px;
  font-weight: bold;
`;

const ExampleImage = styled.Image`
  align-self: center;

  width: ${SCREENWIDTH * 0.6}px;
  height: ${(SCREENWIDTH * 0.6 * 127) / 176}px;

  margin-top: 48px;
`;

const GuideText = styled(TextMain)`
  font-size: 14px;
  font-weight: normal;
  text-align: center;

  margin-top: 24px;
`;

const GuideTextBold = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

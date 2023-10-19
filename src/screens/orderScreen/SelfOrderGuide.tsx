import styled from 'styled-components/native';
import {Container, TextMain} from '../../styles/StyledConsts';
import {SCREENWIDTH} from '../../constants/constants';

const SelfOrderGuide = () => {
  return (
    <Container>
      <SubTitle>
        주문수량, 배송비 고려하는 건 귀찮지 않아! 최저가로 가자
      </SubTitle>
      <Title>해당 쇼핑몰에서 직접 구매</Title>
      <ExampleImage
        source={require('../../assets/img/SelfOrderGuideImg.png')}
        resizeMode="contain"
      />
      <GuideText style={{marginTop: 64}}>
        식품 마다 해당 식품사의 {'\n'}
        공식 쇼핑몰 링크를 드려요
      </GuideText>
      <GuideText>
        <GuideTextBold>최저가로 식품을 구매</GuideTextBold>할 수는 있지만{'\n'}
        식품사가 여러곳이라 주문을 여러번 해야하고{'\n'}각 식품사마다 배송이
        따로 됩니다
      </GuideText>
      <GuideText>
        최소주문이나 배송비를 고려해서{'\n'}
        구매하기 귀찮은 분들은{'\n'}
        <GuideTextBold>두비에게 배송을 요청</GuideTextBold>해주세요!
      </GuideText>
    </Container>
  );
};

export default SelfOrderGuide;

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

  width: ${SCREENWIDTH * 0.9}px;
  height: ${(SCREENWIDTH * 0.9 * 100) / 328}px;

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

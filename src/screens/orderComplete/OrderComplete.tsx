import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

import {
  BtnCTA,
  Col,
  Container,
  TextMain,
  TextSub,
} from '../../shared/ui/styledComps';
import colors from '../../shared/colors';

const getDeliveryDate = () => {
  // 현재 시간 가져오기
  const now = new Date();
  const day = now.getDay();
  const dayList = ['일', '월', '화', '수', '목', '금', '토'];
  // 목금토일 => 다음주 목요일배송 | 월화수 => 토요일 배송
  // 일 -> +4 월 -> +5 | 화 -> +4 | 수 -> +3 목 -> +7 | 금 -> +6 | 토 -> +5 |
  const targetDayNum = [4, 5, 4, 3, 7, 6, 5];

  const targetDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + targetDayNum[day],
  );

  const targetMonth = targetDate.getMonth() + 1;
  const targetDay = targetDate.getDate();
  const targetDayName = dayList[targetDate.getDay()];

  return `${targetMonth}/${targetDay} (${targetDayName})`;
};

// 결제 완료, 구매완료 페이지
const OrderComplete = () => {
  const navigation = useNavigation();

  const goToOrderHistory = () => {
    navigation.reset({
      index: 0,
      routes: [
        {name: 'BottomTabNav', params: {screen: 'NewHome'}},
        {name: 'OrderHistory'},
      ],
    });
  };
  const goToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'BottomTabNav', params: {screen: 'NewHome'}}],
    });
  };
  return (
    <Container>
      <CompleteText>구매 완료!</CompleteText>
      <Desc style={{marginTop: 80}}>
        [다이어트메이트]{'\n'}
        1차 테스트에 참여해주셔서 감사합니다
      </Desc>
      <Desc>
        <Desc>구매한 상품들은{'\n'}</Desc>
        <Desc style={{fontWeight: 'bold', color: colors.textMain}}>
          각 식품사에서 직접 배송
        </Desc>
        이 진행됩니다
      </Desc>
      
      {/* <Box>
        <BoxTitle>식단 예상 도착일</BoxTitle>
        <DateText>{getDeliveryDate()}</DateText>
      </Box> */}
      <Desc>
        배송 문의는 <Desc style={{fontWeight: 'bold', color: colors.textMain}}>
        카톡 1:1 채팅
        </Desc>을 이용해주세요{'\n'} 
        [마이페이지] > [문의하기]
      </Desc>

      <Desc>
        초기 서비스라 불편한 점이 많지만{'\n'}
        빠른 시일 내에 서비스를 개선할게요
      </Desc>

      <BtnBox>
        <BtnCTA btnStyle="border" onPress={goToOrderHistory}>
          <BtnText style={{color: colors.textSub}}>주문내역 바로가기</BtnText>
        </BtnCTA>
        <BtnCTA btnStyle="activated" style={{marginTop: 16}} onPress={goToHome}>
          <BtnText>두비랑 식단구성 더 해보기</BtnText>
        </BtnCTA>
      </BtnBox>
    </Container>
  );
};

export default OrderComplete;

const CompleteText = styled(TextMain)`
  font-size: 36px;
  font-weight: 900;

  margin-top: 48px;
`;

const Desc = styled(TextSub)`
  font-size: 16px;
  font-weight: normal;

  margin-top: 24px;
`;

const Box = styled.View`
  width: 100%;
  height: 128px;

  border-width: 2px;
  border-color: ${colors.highlight};

  justify-content: center;
  align-items: center;

  margin-top: 48px;
`;
const BoxTitle = styled(TextSub)`
  position: absolute;
  font-size: 14px;

  top: 8px;
  left: 8px;
`;
const DateText = styled(TextMain)`
  align-self: center;

  font-size: 24px;
  font-weight: bold;
`;

const BtnBox = styled.View`
  position: absolute;
  bottom: 8px;
  width: 100%;
  align-self: center;
`;

const BtnText = styled(TextMain)`
  font-size: 16px;
  color: ${colors.white};
`;

// Description: 장바구니 페이지에서 총 끼니 수, 상품 수, 금액을 보여주는 컴포넌트
//RN, 3rd
import styled from 'styled-components/native';
//doobi util, redux, etc
import colors from '../../styles/colors';
//doobi Component
import {
  HorizontalLine,
  Row,
  TextMain,
  TextSub,
} from '../../styles/StyledConsts';
import {
  commaToNum,
  reGroupByDietNo,
  sumUpDietTotal,
  sumUpPrice,
} from '../../util/sumUp';

import {
  useListDiet,
  useListDietDetailAll,
  useListDietTotal,
} from '../../query/queries/diet';

const CartSummary = () => {
  // react-query
  const {data: dietDetailAllData} = useListDietDetailAll();

  // 총 끼니 수, 상품 수, 금액 계산
  const dietTotalData = reGroupByDietNo(dietDetailAllData);
  const {menuNum, productNum, priceTotal} = sumUpDietTotal(dietTotalData);

  return (
    <TotalSummaryContainer>
      <SummaryText style={{marginTop: 24}}>총 끼니 ({menuNum} 개)</SummaryText>
      <HorizontalLine style={{marginTop: 8}} />
      <Row style={{marginTop: 16, justifyContent: 'space-between'}}>
        <SummaryText>상품 가격 (총 {productNum} 개)</SummaryText>
        <SummaryValue>{commaToNum(priceTotal)} 원</SummaryValue>
      </Row>
      <Row style={{marginTop: 8, justifyContent: 'space-between'}}>
        <SummaryText>배송비 (30,000원 이상 무료배송)</SummaryText>
        <SummaryValue>{priceTotal >= 30000 ? '무료' : '4,000원'}</SummaryValue>
      </Row>
    </TotalSummaryContainer>
  );
};

export default CartSummary;

const TotalSummaryContainer = styled.View`
  padding: 0px 16px 24px 16px;
  background-color: ${colors.white};
`;

const SummaryText = styled(TextMain)`
  font-size: 14px;
`;

const SummaryValue = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

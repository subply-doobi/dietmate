import {View} from 'react-native';
import styled from 'styled-components/native';

import {
  HorizontalLine,
  Row,
  TextMain,
  TextSub,
} from '../../styles/StyledConsts';
import {commaToNum, sumUpDietTotal} from '../../util/sumUp';

import {
  useListDiet,
  useListDietDetailAll,
  useListDietTotal,
} from '../../query/queries/diet';
import colors from '../../styles/colors';

const CartSummary = () => {
  // react-query
  const {data: dietData} = useListDiet();
  const {data: dietAllData} = useListDietDetailAll();
  const dietTotalData = useListDietTotal(dietData, {
    enabled: !!dietData,
  });

  // 총 끼니 수, 상품 수, 금액 계산
  const {menuNum, productNum, priceTotal} = dietTotalData
    ? sumUpDietTotal(dietTotalData)
    : {menuNum: 0, productNum: 0, priceTotal: 0};

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
        <SummaryValue>{priceTotal >= 30000 ? '0' : '4,000'} 원</SummaryValue>
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

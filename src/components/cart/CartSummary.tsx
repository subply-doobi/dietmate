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
} from '../../styles/styledConsts';
import {
  commaToNum,
  reGroupByDietNo,
  reGroupBySeller,
  sumUpDietTotal,
} from '../../util/sumUp';

import {
  useListDiet,
  useListDietDetailAll,
  useListDietTotal,
} from '../../query/queries/diet';
import {useDispatch} from 'react-redux';
import {setMenuActiveSection} from '../../stores/slices/cartSlice';
import {View} from 'react-native';
import {SERVICE_PRICE_PER_PRODUCT} from '../../constants/constants';

const CartSummary = (props: any) => {
  const {onScrollToTop} = props;
  //redux
  const dispatch = useDispatch();
  // react-query
  const {data: dietDetailAllData} = useListDietDetailAll();

  //platformNm으로 그룹핑
  const regroupedDDAData =
    dietDetailAllData && reGroupBySeller(dietDetailAllData);

  // 총 끼니 수, 상품 수, 금액 계산
  const dietTotalData = reGroupByDietNo(dietDetailAllData);
  const {menuNum, productNum, priceTotal} = sumUpDietTotal(dietTotalData);

  // 식품사: platformNm 식품: productNm 갯수: qty
  const priceFromPlatformNm = regroupedDDAData?.map(item => {
    return item.reduce((acc, cur) => {
      return (
        acc +
        (parseInt(cur.price) + SERVICE_PRICE_PER_PRODUCT) * parseInt(cur.qty)
      );
    }, 0);
  });

  //regroupedDDAData에서 platformNm의 dietSeq 구하기
  const getDietSeq = (i: string) =>
    regroupedDDAData[i]?.map(item => {
      return item.dietSeq;
    });

  //dietSeq 중복 제거
  let getResult = (i: string) => [...new Set(getDietSeq(i))];

  return (
    <TotalSummaryContainer>
      <Row style={{marginTop: 24, justifyContent: 'space-between'}}>
        <SummaryText>총 끼니 ({menuNum} 개)</SummaryText>
        <SummaryValue>
          끼니 당{' '}
          {menuNum === 0 ? 0 : commaToNum(Math.floor(priceTotal / menuNum))} 원
        </SummaryValue>
      </Row>
      <HorizontalLine style={{marginTop: 8}} />
      {regroupedDDAData?.map((item, index) => {
        return (
          <View key={index}>
            <SummaryValue style={{marginTop: 24}}>
              {item[0].platformNm}
            </SummaryValue>
            <SummaryText style={{marginTop: 12}}>
              식품:{' '}
              {!!priceFromPlatformNm && commaToNum(priceFromPlatformNm[index])}
              원
            </SummaryText>
            <TextSub style={{marginTop: 2}}>배송비:3000원</TextSub>
            <Row style={{marginTop: 16}}>
              {getResult(index).map((item: any, index) => {
                let activeSections = [item.replace(/[^0-9]/g, '') - 1];
                return (
                  <SmallButton
                    key={index}
                    onPress={() => {
                      dispatch(setMenuActiveSection(activeSections));
                      onScrollToTop();
                    }}>
                    <TextSub>{item}</TextSub>
                  </SmallButton>
                );
              })}
            </Row>
          </View>
        );
      })}

      <HorizontalLine style={{marginTop: 8}} />

      <Row style={{marginTop: 16, justifyContent: 'space-between'}}>
        <SummaryText>상품 가격 (총 {productNum} 개)</SummaryText>
        <SummaryValue>{commaToNum(priceTotal)} 원</SummaryValue>
      </Row>
      <Row style={{marginTop: 8, justifyContent: 'space-between'}}>
        <SummaryText>배송비 </SummaryText>
        <SummaryValue>{'4,000원'}</SummaryValue>
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

const SmallButton = styled.TouchableOpacity`
  width: 46px;
  height: 32px;
  border-radius: 5px;
  border: 1px solid ${colors.lineLight};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

// RN
import {useEffect} from 'react';
import {ScrollView} from 'react-native';

// 3rd
import styled from 'styled-components/native';

// doobi
import {INQUIRY_URL} from '../../shared/constants';
import colors from '../../shared/colors';
import {commaToNum, sumUpPrice} from '../../shared/utils/sumUp';
import {useNavigation, useRoute} from '@react-navigation/native';
import {IOrderedProduct} from '../../shared/api/types/order';
import {link} from '../../shared/utils/linking';
import {reGroupOrderBySeller} from '../../shared/utils/dataTransform';
import MenuSection from '../../components/common/menuSection/MenuSection';
import MenuList from './ui/MenuList';
import {
  TextMain,
  VerticalLine,
  Col,
  Row,
  TextSub,
  HorizontalSpace,
  BtnSmall,
  BtnSmallText,
} from '../../shared/ui/styledComps';

// main component
const OrderHistoryDetail = () => {
  // navigation
  const route = useRoute();
  const navigation = useNavigation();
  const {
    orderDetailData,
    totalPrice,
  }: {
    orderDetailData: Readonly<IOrderedProduct[][]>;
    totalPrice: Readonly<number>;
  } = route.params;

  // useEffect
  useEffect(() => {
    orderDetailData &&
      navigation.setOptions({
        title: orderDetailData[0][0]?.buyDate,
      });
  }, []);

  // etc
  const isSelfOrder = orderDetailData[0][0]?.orderTypeCd === String('SP011001');

  // 판매자별 주문식품, 전체 배송비 합계
  const orderedProductAll = orderDetailData?.reduce((acc, cur) => {
    return acc.concat(cur);
  }, []);
  const regroupedOrderedData = reGroupOrderBySeller(orderedProductAll);
  const totalShippingPrice = orderedProductAll[0].shippingPrice;

  return (
    <Container>
      {/* 끼니선택, NutrientProgress 부분 */}
      <MenuSection />
      <ScrollView>
        <InquireBtn onPress={() => link(INQUIRY_URL)}>
          <BtnSmallText>문의하기</BtnSmallText>
        </InquireBtn>

        {/* 각 끼니 카드 */}
        <MenuList orderDetailData={orderDetailData} />

        {/* 전체주문요약 */}
        {isSelfOrder || (
          <Col>
            {/* 배송지 */}
            <SummaryContainer>
              <SummaryTitle>배송지</SummaryTitle>
              <Row>
                <SummaryAddressText>
                  {orderDetailData[0][0]?.buyerName}
                  <VerticalLine />
                  {orderDetailData[0][0]?.buyerTel}
                </SummaryAddressText>
              </Row>
              <Row>
                {/* <SummarySubText>{orderDetailData?.buyerZipCode}</SummarySubText> */}
                <SummaryAddressText>
                  {orderDetailData[0][0]?.buyerAddr}
                </SummaryAddressText>
              </Row>
            </SummaryContainer>

            {/* 결제수단 */}
            <SummaryContainer>
              <SummaryTitle>결제수단</SummaryTitle>
              <SummaryPMText style={{color: colors.textSub}}>
                {orderDetailData[0][0]?.payMethod}
              </SummaryPMText>
            </SummaryContainer>

            {/* 결제금액 */}
            <SummaryContainer style={{paddingBottom: 24}}>
              <SummaryTitle>결제금액</SummaryTitle>
              <HorizontalSpace height={16} />
              {/* 각 판매자별 금액 */}
              {regroupedOrderedData.map((item, index) => (
                <Col key={index}>
                  <SummarySellerText>{item[0].platformNm}</SummarySellerText>
                  <SummaryPriceText>
                    {commaToNum(sumUpPrice(item, true))}원
                  </SummaryPriceText>
                </Col>
              ))}

              {/* 배송비, 전체합계 */}
              <ShippingPriceText>
                배송비: {commaToNum(totalShippingPrice)}원
              </ShippingPriceText>
              <PriceTotal style={{alignSelf: 'flex-end'}}>
                전체 합계: {commaToNum(totalPrice)}원
              </PriceTotal>
            </SummaryContainer>
          </Col>
        )}
      </ScrollView>
    </Container>
  );
};

export default OrderHistoryDetail;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundLight2};
`;

const InquireBtn = styled(BtnSmall)`
  align-self: flex-end;
  margin-right: 10px;
  margin-bottom: -8px;
`;

const SummaryContainer = styled.View`
  flex: 1;
  background-color: ${colors.white};
  margin-top: 16px;
  padding: 0px 16px 16px 16px;
`;

const SummaryTitle = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;

  margin-top: 16px;
`;

const SummaryAddressText = styled(TextSub)`
  font-size: 14px;
  margin-top: 2px;
`;
const SummaryPMText = styled(TextSub)`
  font-size: 14px;
  margin-top: 2px;
`;

const SummarySellerText = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
  margin-top: 16px;
`;
const SummaryPriceText = styled(TextMain)`
  font-size: 14px;
  margin-top: 2px;
`;

const ShippingPriceText = styled(TextSub)`
  align-self: flex-end;
  font-size: 14px;
  margin-top: 32px;
`;

const PriceTotal = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;

  margin-top: 4px;
`;

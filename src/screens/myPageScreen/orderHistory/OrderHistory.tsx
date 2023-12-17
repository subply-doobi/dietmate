// react, RN, 3rd
import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';

// Components
import {
  Col,
  HorizontalLine,
  Row,
  TextMain,
  TextSub,
  VerticalLine,
  Container,
} from '../../../styles/styledConsts';
import DAlert from '../../../components/common/alert/DAlert';
import CommonAlertContent from '../../../components/common/alert/CommonAlertContent';

// util
import colors from '../../../styles/colors';
import {icons} from '../../../assets/icons/iconSource';

// react-query
import {useListOrder} from '../../../query/queries/order';
import {BASE_URL} from '../../../query/queries/urls';
import {commaToNum, sumUpNutrients, sumUpPrice} from '../../../util/sumUp';
import {regroupByBuyDateAndDietNo} from '../../../util/common/regroup';
import {IOrderedProduct} from '../../../query/types/order';

const OrderedMenu = ({order}: {order: IOrderedProduct[][]}) => {
  return (
    <Row>
      <ArrowImage source={icons.arrowLeft_20} />
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {/* 주문 내 끼니 별 반복 */}
        {order.map((menu, menuIdx) => (
          <Col key={menuIdx}>
            <CaloriesText>
              {commaToNum(sumUpNutrients(menu).cal)} kcal
            </CaloriesText>
            <Row
              style={{
                marginTop: 8,
                columnGap: 8,
              }}>
              {/* 끼니 내 식품 별 반복 */}
              {menu.map((product: any, productIdx: number) => (
                <ThumbnailImage
                  key={productIdx}
                  source={{
                    uri: `${BASE_URL}${product.mainAttUrl}`,
                  }}
                />
              ))}
              <VerticalLine
                style={{
                  backgroundColor: colors.line,
                  marginRight: 8,
                }}
              />
            </Row>
          </Col>
        ))}
      </ScrollView>
      <ArrowImage source={icons.arrowRight_20} />
    </Row>
  );
};

const OrderHistory = () => {
  // navigation
  const {data: orderData, isLoading} = useListOrder();
  const {navigate} = useNavigation();

  // useState
  const [emptyAlertShow, setEmptyAlertShow] = useState(false);

  // useEffect
  // 주문정보 비어있는지 확인
  useEffect(() => {
    orderData?.length === 0 && setEmptyAlertShow(true);
  }, [orderData]);

  // 구매날짜, dietNo로 식단 묶기
  const regroupedData = regroupByBuyDateAndDietNo(orderData);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 주문날짜 별로 반복*/}
        {regroupedData?.map((order, orderIdx) => {
          return (
            <OrderBox key={orderIdx}>
              <Row style={{justifyContent: 'space-between', marginTop: 24}}>
                <OrderDate>{order[0][0].buyDate}</OrderDate>
                <DetailBtn
                  onPress={() =>
                    navigate('OrderHistoryNav', {
                      screen: 'OrderHistoryDetail',
                      params: {
                        orderDetailData: order,
                        totalPrice: order[0][0].orderPrice,
                      },
                    })
                  }>
                  <DetailBtnText>상세보기</DetailBtnText>
                </DetailBtn>
              </Row>
              <HorizontalLine />

              {/* 해당 주문에 구매한 끼니들 */}
              <OrderedMenu order={order} />
              <HorizontalLine style={{marginTop: 8}} />

              {/* 해당 주문 금액 or 스스로구매 */}
              {order[0][0].orderTypeCd === 'SP011001' ? (
                <SelfOrderTextBox>
                  <SelfOrderText>직접 구매한 식단</SelfOrderText>
                </SelfOrderTextBox>
              ) : (
                <TotalPrice>{commaToNum(order[0][0].orderPrice)} 원</TotalPrice>
              )}
            </OrderBox>
          );
        })}
      </ScrollView>

      {/* 주문내역 없을 때 알럿 */}
      <DAlert
        alertShow={emptyAlertShow}
        NoOfBtn={1}
        onConfirm={() => setEmptyAlertShow(false)}
        onCancel={() => setEmptyAlertShow(false)}
        renderContent={() => (
          <CommonAlertContent text="아직 주문내역이 없어요" />
        )}
      />
    </Container>
  );
};

export default OrderHistory;

const OrderBox = styled.View``;

const OrderDate = styled(TextSub)`
  font-size: 12px;
`;
const DetailBtn = styled.TouchableOpacity`
  width: 64px;
  height: 24px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${colors.lineLight};
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  margin-left: 8px;
`;

const DetailBtnText = styled(TextMain)`
  font-size: 14px;
`;

const CaloriesText = styled(TextMain)`
  margin-top: 8px;
  font-size: 14px;
`;

const ThumbnailImage = styled.Image`
  background-color: ${colors.backgroundLight};
  width: 56px;
  height: 56px;
  border-radius: 2px;
`;
const ArrowImage = styled.Image`
  margin-top: 28px;
  width: 20px;
  height: 20px;
`;
const TotalPrice = styled(TextMain)`
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
  align-self: flex-end;
`;

const SelfOrderTextBox = styled.View`
  height: 24px;
  width: 100%;
  background-color: ${colors.backgroundLight2};

  justify-content: center;
  align-items: flex-end;

  margin-top: 8px;
  padding: 0px 8px 0px 0px;
`;

const SelfOrderText = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;

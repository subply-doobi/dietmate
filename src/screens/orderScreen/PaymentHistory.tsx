import React from 'react';
import {FlatList, SafeAreaView} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

import {RootState} from '../../stores/store';
import {icons} from '../../assets/icons/iconSource';
import {
  Col,
  HorizontalLine,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
  VerticalLine,
  VerticalSpace,
  Container,
} from '../../styles/StyledConsts';
import colors from '../../styles/colors';
import {NavigationProps} from '../../constants/constants';
import {useNavigation} from '@react-navigation/native';
import {useUpdateDiet} from '../../query/queries/diet';
import {useGetOrder, useUpdateOrder} from '../../query/queries/order';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native';
import {BASE_URL} from '../../query/queries/urls';
import {commaToNum, sumUpNutrients} from '../../util/sumUp';
import {isSearchBarAvailableForCurrentPlatform} from 'react-native-screens';
import {IProductData} from '../../query/types/product';
import {IOrderedProduct} from '../../query/types/order';

const PaymentHistory = () => {
  const {data: orderData, isLoading} = useGetOrder();
  const {navigate} = useNavigation();
  //dietNo별로 새로 만든 배열
  const orderDataGroupedByDietNo = orderData?.reduce((acc, cur) => {
    if (acc[cur.dietNo]) {
      acc[cur.dietNo].push(cur);
    } else {
      acc[cur.dietNo] = [cur];
    }
    return acc;
  }, {});

  //orderDataGroupedByDietNo key제거
  const orderDataGroupedByDietNoWithoutKey = Object.values(
    orderDataGroupedByDietNo,
  );

  //날짜별로 구매내역
  const orderDataGroupedByBuyDate = orderDataGroupedByDietNoWithoutKey?.reduce(
    (acc, cur) => {
      if (acc[cur[0].buyDate]) {
        acc[cur[0].buyDate].push(cur);
      } else {
        acc[cur[0].buyDate] = [cur];
      }
      return acc;
    },
    {},
  );

  const productData = Object.values(orderDataGroupedByBuyDate);

  //dietNo별로 칼로리 총합
  const totalCalorie = (arg: number) =>
    orderDataGroupedByDietNoWithoutKey[arg]?.reduce((acc: any, cur: any) => {
      return acc + parseInt(cur.calorie);
    }, 0);

  //주문별 총합
  const totalPrice = (productDataIdx: number) =>
    productData[productDataIdx]?.reduce((acc: any, cur: any) => {
      if (cur[0]?.price === undefined) return acc;
      return (
        acc +
        cur.reduce((acc: any, cur: any) => {
          return acc + parseInt(cur?.price);
        }, 0)
      );
    }, 0);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <Container>
      <ScrollView>
        {/* 주문날짜 별로 반복*/}
        {productData.map((order, orderIdx) => {
          return (
            <OrderBox key={orderIdx}>
              <Row style={{justifyContent: 'space-between'}}>
                <OrderDate>{order[0][0].buyDate}</OrderDate>
                <DetailBtn
                  onPress={() =>
                    navigate('PaymentHistoryNav', {
                      screen: 'PaymentDetail',
                      params: {
                        productData: order,
                        buyDate: order[0][0].buyDate,
                        totalPrice: totalPrice(orderIdx),
                        orderNo: order[0][0].orderNo,
                        qty: order[0][0].qty,
                      },
                    })
                  }>
                  <DetailBtnText>상세보기</DetailBtnText>
                </DetailBtn>
              </Row>
              <HorizontalLine />
              <Row>
                <ArrowImage source={icons.arrowLeft_20} />
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  {/* 주문 내 끼니 별 반복 */}
                  {order.map((menu: any, menuIdx: number) => (
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
              <HorizontalLine style={{marginTop: 8}} />
              <TotalPrice>{commaToNum(totalPrice(orderIdx))} 원</TotalPrice>
            </OrderBox>
          );
        })}
      </ScrollView>
    </Container>
  );
};

export default PaymentHistory;

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
  margin-bottom: 24px;
  font-size: 16px;
  font-weight: bold;
  align-self: flex-end;
`;

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
import {commaToNum} from '../../util/sumUp';
import {isSearchBarAvailableForCurrentPlatform} from 'react-native-screens';
interface IOrderData {
  buyDate: string;
  calorie: string;
}
interface IOrderDataGroupedByBuyDate {
  [key: string]: IOrderData[];
}
interface IProductData {
  buyDate: string;
  calorie: string;
  crb: string;
  mainAttUrl: string;
  price: string;
  dietNo: string;
}
const PaymentHistory = () => {
  const {data: orderData, isLoading} = useGetOrder();
  console.log('orderData', orderData);
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
  const orderDataGroupedByBuyDate: IOrderDataGroupedByBuyDate =
    orderDataGroupedByDietNoWithoutKey?.reduce((acc: any, cur: any) => {
      if (acc[cur[0].buyDate]) {
        acc[cur[0].buyDate].push(cur);
      } else {
        acc[cur[0].buyDate] = [cur];
      }
      return acc;
    }, {});

  const buyDate = Object.keys(orderDataGroupedByBuyDate);
  const productData = Object.values(orderDataGroupedByBuyDate);
  // console.log(orderDataGroupedByDietNo);
  //dietNo별로 칼로리 총합
  const totalCalorie = (arg: number) =>
    orderDataGroupedByDietNoWithoutKey[arg]?.reduce((acc: any, cur: any) => {
      return acc + parseInt(cur.calorie);
    }, 0);
  //주문별 총합
  const totalPrice = (arg: number) =>
    productData[arg]?.reduce((acc: any, cur: any) => {
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
        {buyDate.map((e, i) => (
          <Col key={i}>
            <Row style={{justifyContent: 'space-between'}}>
              <OrderDate>{e}</OrderDate>
              <DetailBtn
                onPress={() =>
                  navigate('PaymentHistoryNav', {
                    screen: 'PaymentDetail',
                    params: {
                      productData: productData[i],
                      buyDate: e,
                      totalPrice: totalPrice(i),
                      orderNo: productData[i][0][0].orderNo,
                      qty: productData[i][0][0].qty,
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
                {productData[i].map(
                  (element: any, productDataIndex: number, array) => {
                    return (
                      <Col key={i + productDataIndex}>
                        <MakeVertical>
                          <CaloriesText>
                            {i === 0
                              ? totalCalorie(productDataIndex)
                              : totalCalorie(
                                  productDataIndex + productData[i - 1]?.length,
                                )}
                            kcal
                          </CaloriesText>
                          <Row style={{marginTop: 8}}>
                            {element.map((ele: any, eleIndex: number) => {
                              return (
                                <Col key={eleIndex}>
                                  <ThumbnailImage
                                    source={{
                                      uri: `${BASE_URL}${ele.mainAttUrl}`,
                                    }}
                                  />
                                </Col>
                              );
                            })}
                            <VerticalLine
                              style={{
                                marginLeft: 8,
                                backgroundColor: colors.line,
                              }}
                            />
                          </Row>
                        </MakeVertical>
                      </Col>
                    );
                  },
                )}
              </ScrollView>
              <ArrowImage source={icons.arrowRight_20} />
            </Row>
            <HorizontalLine style={{marginTop: 8}} />
            <TotalPrice>{commaToNum(totalPrice(i))}원</TotalPrice>
          </Col>
        ))}
      </ScrollView>
    </Container>
  );
};

export default PaymentHistory;

const OrderDate = styled(TextSub)`
  font-size: 12px;
`;
const OrderDateContainer = styled.View`
  justify-content: space-between;
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
const MakeVertical = styled.View`
  flex-direction: column;
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
  margin-left: 8px;
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

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
} from '../../styles/StyledConsts';
import colors from '../../styles/colors';
import {NavigationProps} from '../../constants/constants';
import {useUpdateDiet} from '../../query/queries/diet';
import {useGetOrder, useUpdateOrder} from '../../query/queries/order';
import {ScrollView} from 'react-native-gesture-handler';
import {ActivityIndicator} from 'react-native';
import {BASE_URL} from '../../query/queries/urls';

interface IOrderData {
  buyDate: string;
  calorie: string;
  crb: string;
}
interface IOrderDataGroupedByBuyDate {
  [key: string]: IOrderData[];
}
const PaymentHistory = ({navigation, route}: NavigationProps) => {
  const {data: orderData, isLoading} = useGetOrder();
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
  const orderDataGroupedByDietNoArray = Object.values(orderDataGroupedByDietNo);

  //orderDataGroupedByBuyDate
  const orderDataGroupedByBuyDate: IOrderDataGroupedByBuyDate =
    orderDataGroupedByDietNoArray?.reduce((acc: any, cur: any) => {
      if (acc[cur[0].buyDate]) {
        acc[cur[0].buyDate].push(cur);
      } else {
        acc[cur[0].buyDate] = [cur];
      }
      return acc;
    }, {});

  const buyDate = Object.keys(orderDataGroupedByBuyDate);
  const productData = Object.values(orderDataGroupedByBuyDate);
  console.log(productData[0]);
  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <ScrollView>
      {buyDate.map((e, i) => (
        <Col key={i}>
          <Row>
            <OrderDate>{e}</OrderDate>
            <DetailBtn>
              <DetailBtnText>상세보기</DetailBtnText>
            </DetailBtn>
          </Row>
          <HorizontalLine />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {productData[i].map((e, i) => {
              return (
                <>
                  <MakeVertical>
                    {e.map(e => {
                      return <CaloriesText>{e?.calorie}kcal</CaloriesText>;
                    })}
                    <Row>
                      {e.map(e => {
                        return (
                          <>
                            <ThumbnailImage
                              source={{uri: `${BASE_URL}${e.mainAttUrl}`}}
                            />
                          </>
                        );
                      })}
                      <VerticalLine
                        style={{margin: 20, width: 20, backgroundColor: 'red'}}
                      />
                    </Row>
                  </MakeVertical>
                </>
              );
            })}
          </ScrollView>
        </Col>
      ))}
    </ScrollView>
  );
};

export default PaymentHistory;

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
`;
const MakeVertical = styled.View`
  flex-direction: column;
`;
const DetailBtnText = styled(TextMain)`
  font-size: 14px;
`;

const CaloriesText = styled(TextMain)`
  margin-top: 8px;
  font-size: 20px;
`;

const Arrow = styled.Image`
  margin-top: 32px;
  width: 20px;
  height: 20px;
`;

const ThumbnailImage = styled.Image`
  background-color: ${colors.backgroundLight};
  width: 56px;
  height: 56px;
  border-radius: 2px;
`;

const TotalPrice = styled(TextMain)`
  margin-top: 8px;
  font-size: 16px;
  font-weight: bold;
  align-self: flex-end;
`;

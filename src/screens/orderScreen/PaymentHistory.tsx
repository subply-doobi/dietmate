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

const PaymentHistory = ({navigation, route}: NavigationProps) => {
  const {data: orderData, isLoading} = useGetOrder();
  // add all calorie of orderData except undefined
  const totalCalorie = orderData
    ?.map(e => e.calorie)
    .filter(e => e !== undefined)
    .reduce((acc, cur) => acc + parseInt(cur), 0);
  const updateDietMutation = useUpdateDiet();
  const updateOrderMutation = useUpdateOrder();

  //dietNo별로 새로 만든 배열
  const orderDataGroupedByDietNo = orderData?.reduce((acc, cur) => {
    if (acc[cur.dietNo]) {
      acc[cur.dietNo].push(cur);
    } else {
      acc[cur.dietNo] = [cur];
    }
    return acc;
  }, {});
  //remove key of orderDataGroupedByDietNo
  const orderDataGroupedByDietNoArray = Object.values(orderDataGroupedByDietNo);

  //orderDataGroupedByBuyDate가 원하는 data 모양
  const orderDataGroupedByBuyDate = orderDataGroupedByDietNoArray?.reduce(
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

  // const buyDate = Object.keys(orderDataGroupedByBuyDate);
  const productData = Object.values(orderDataGroupedByBuyDate);
  console.log('productData', productData[1]?.length);
  const renderProduct = arg => {
    for (let i = 0; i < productData[1]?.length; i++) {
      return productData[arg][i].map((e, i) => (
        <>
          <ThumbnailImage source={{uri: `${BASE_URL}${e.mainAttUrl}`}} />
        </>
      ));
    }
  };
  const test = arg => {
    for (let i = 0; i < productData.length; i++) {
      console.log('testest', i);
    }
  };
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
            <Row>
              {/* {productData[i][0].map((e, i) => (
                <>
                  <ThumbnailImage
                    source={{uri: `${BASE_URL}${e.mainAttUrl}`}}
                  />
                </>
              ))}
              <VerticalLine
                style={{margin: 20, width: 20, backgroundColor: 'red'}}
              />
              {productData[i][1].map((e, i) => (
                <>
                  <ThumbnailImage
                    source={{uri: `${BASE_URL}${e.mainAttUrl}`}}
                  />
                </>
              ))}
              <VerticalLine
                style={{margin: 20, width: 20, backgroundColor: 'red'}}
              />
              {productData[i][2]?.map((e, i) => (
                <>
                  <ThumbnailImage
                    source={{uri: `${BASE_URL}${e.mainAttUrl}`}}
                  />
                </>
              ))}
              <VerticalLine
                style={{margin: 20, width: 20, backgroundColor: 'red'}}
              />
              {productData[i][3]?.map((e, i) => (
                <>
                  <ThumbnailImage
                    source={{uri: `${BASE_URL}${e.mainAttUrl}`}}
                  />
                </>
              ))} */}
              {renderProduct(i)}
            </Row>
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

const DetailBtnText = styled(TextMain)`
  font-size: 14px;
`;

const CaloriesText = styled(TextMain)`
  margin-top: 8px;
  font-size: 14px;
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

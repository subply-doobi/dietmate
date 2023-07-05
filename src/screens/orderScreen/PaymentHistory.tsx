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
  console.log(totalCalorie);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <ScrollView>
      <OrderDate>{orderData[0]?.buyDate}</OrderDate>
      {orderData?.map((e, i) => {
        return (
          <Col key={i}>
            <CaloriesText>{totalCalorie}</CaloriesText>
          </Col>
        );
      })}
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

const ThumbnailImage = styled.View`
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

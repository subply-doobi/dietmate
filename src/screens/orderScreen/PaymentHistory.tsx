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
} from '../../styles/styledConsts';
import colors from '../../styles/colors';
import {NavigationProps} from '../../constants/constants';

interface IOrder {
  id: string;
  date: string;
  menu: Array<{
    id: string;
    foods: Array<number>;
    menuCalories: string;
    nutr: Array<{nutr: string; value: string}>;
  }>;
  totalPrice: string;
}
const testData: Array<IOrder> = [
  {
    id: '1',
    date: '2022.07.11 | 16.32',
    menu: [
      {
        id: '1',
        foods: [1, 2, 3],
        menuCalories: '830kcal',
        nutr: [
          {nutr: '칼로리', value: '521 kcal'},
          {nutr: '탄수화물', value: '61 g'},
          {nutr: '단백질', value: '30 g'},
          {nutr: '지방', value: '14 g'},
        ],
      },
      {
        id: '2',
        foods: [4, 5],
        menuCalories: '817kcal',
        nutr: [
          {nutr: '칼로리', value: '521 kcal'},
          {nutr: '탄수화물', value: '61 g'},
          {nutr: '단백질', value: '30 g'},
          {nutr: '지방', value: '14 g'},
        ],
      },
    ],
    totalPrice: '25000',
  },
  {
    id: '2',
    date: '2022.07.11 | 16.32',
    menu: [
      {
        id: '1',
        foods: [1, 2, 3],
        menuCalories: '830kcal',
        nutr: [
          {nutr: '칼로리', value: '521 kcal'},
          {nutr: '탄수화물', value: '61 g'},
          {nutr: '단백질', value: '30 g'},
          {nutr: '지방', value: '14 g'},
        ],
      },
      {
        id: '2',
        foods: [4, 5],
        menuCalories: '817kcal',
        nutr: [
          {nutr: '칼로리', value: '521 kcal'},
          {nutr: '탄수화물', value: '61 g'},
          {nutr: '단백질', value: '30 g'},
          {nutr: '지방', value: '14 g'},
        ],
      },
      {
        id: '3',
        foods: [6, 7, 8],
        menuCalories: '817kcal',
        nutr: [
          {nutr: '칼로리', value: '521 kcal'},
          {nutr: '탄수화물', value: '61 g'},
          {nutr: '단백질', value: '30 g'},
          {nutr: '지방', value: '14 g'},
        ],
      },
    ],
    totalPrice: '25000',
  },
];

const PaymentHistory = ({navigation, route}: NavigationProps) => {
  const {pgToken, tid, foodPrice} = useSelector(
    (state: RootState) => state.order.orderSummary,
  );

  type IMenu = {id: string; foods: number[]; menuCalories: string};

  const renderMenuList = ({item}: {item: IMenu}) => {
    return (
      <Col>
        <CaloriesText>{item.menuCalories}</CaloriesText>
        <Row style={{marginTop: 8}}>
          {item.foods.map((food, index) => (
            <Row key={index}>
              <ThumbnailImage />
              {item.foods.length - 1 === index || <VerticalSpace width={8} />}
            </Row>
          ))}
        </Row>
      </Col>
    );
  };

  const renderOrderList = ({item}: {item: IOrder}) => (
    <>
      <Row
        style={{
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
        <OrderDate>{item.date}</OrderDate>
        <DetailBtn
          onPress={() =>
            navigate('PaymentDetail', {
              item,
            })
          }>
          <DetailBtnText>상세보기</DetailBtnText>
        </DetailBtn>
      </Row>
      <HorizontalLine style={{marginTop: 8}} />
      <Row>
        <Arrow source={icons.arrowLeft_20} />
        <FlatList
          horizontal={true}
          data={item.menu}
          renderItem={renderMenuList}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <VerticalLine
              height={56}
              style={{marginHorizontal: 8, alignSelf: 'flex-end'}}
            />
          )}
        />
        <Arrow source={icons.arrowRight_20} />
      </Row>
      <TotalPrice>{item.totalPrice} 원</TotalPrice>
    </>
  );
  return (
    <SafeAreaView style={{flex: 1, marginHorizontal: 16}}>
      <HorizontalSpace height={24} />
      <FlatList
        data={testData}
        renderItem={renderOrderList}
        ItemSeparatorComponent={() => <HorizontalSpace height={24} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
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

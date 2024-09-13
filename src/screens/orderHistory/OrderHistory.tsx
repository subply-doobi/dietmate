// react, RN, 3rd
import {useEffect, useState} from 'react';
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
} from '../../shared/ui/styledComps';
import DAlert from '../../shared/ui/DAlert';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';

// util
import colors from '../../shared/colors';
import {icons} from '../../shared/iconSource';

// react-query
import {useListOrder} from '../../shared/api/queries/order';
import {commaToNum, sumUpNutrients} from '../../shared/utils/sumUp';
import {regroupByBuyDateAndDietNo} from '../../shared/utils/dataTransform';
import {IOrderedProduct} from '../../shared/api/types/order';
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../app/store/reduxStore';
import {openModal, closeModal} from '../../features/reduxSlices/modalSlice';
import {SCREENWIDTH} from '../../shared/constants';

const OrderedMenu = ({order}: {order: IOrderedProduct[][]}) => {
  return (
    <Row>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <ArrowImage source={icons.arrowLeft_20} />
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
                    uri: `${Config.BASE_URL}${product.mainAttUrl}`,
                  }}
                />
              ))}
              {menuIdx !== order.length - 1 && (
                <VerticalLine
                  style={{
                    backgroundColor: colors.lineLight,
                    marginLeft: 8,
                    marginRight: 16,
                  }}
                />
              )}
            </Row>
          </Col>
        ))}
        <ArrowImage source={icons.arrowRight_20} />
      </ScrollView>
    </Row>
  );
};

const OrderHistory = () => {
  // redux
  const dispatch = useDispatch();
  const orderEmptyAlert = useSelector(
    (state: RootState) => state.modal.modal.orderEmptyAlert,
  );

  // navigation
  const {data: orderData, isLoading} = useListOrder();
  const {navigate, goBack} = useNavigation();

  // useEffect
  // 주문정보 비어있는지 확인
  useEffect(() => {
    orderData?.length === 0 && dispatch(openModal({name: 'orderEmptyAlert'}));
  }, [orderData]);

  // 구매날짜, dietNo로 식단 묶기
  const regroupedData = regroupByBuyDateAndDietNo(orderData);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <Container style={{paddingLeft: 0, paddingRight: 0}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 주문날짜 별로 반복*/}
        <Col style={{rowGap: 64, marginTop: 24}}>
          {regroupedData?.map((order, orderIdx) => (
            <OrderBox key={orderIdx}>
              <Row
                style={{
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                }}>
                <OrderDate>{order[0][0].buyDate}</OrderDate>
                <DetailBtn
                  onPress={() =>
                    navigate('OrderHistoryDetail', {
                      orderDetailData: order,
                      totalPrice: order[0][0].orderPrice,
                    })
                  }>
                  <DetailBtnText>상세보기</DetailBtnText>
                </DetailBtn>
              </Row>
              <HorizontalLine
                width={SCREENWIDTH - 32}
                style={{alignSelf: 'center'}}
              />

              {/* 해당 주문에 구매한 끼니들 */}
              <OrderedMenu order={order} />

              {/* 해당 주문 금액 */}
              <TotalPrice>{commaToNum(order[0][0].orderPrice)} 원</TotalPrice>
            </OrderBox>
          ))}
        </Col>
      </ScrollView>

      {/* 주문내역 없을 때 알럿 */}
      <DAlert
        alertShow={orderEmptyAlert.isOpen}
        NoOfBtn={1}
        onConfirm={() => {
          dispatch(closeModal({name: 'orderEmptyAlert'}));
          goBack();
        }}
        onCancel={() => {
          dispatch(closeModal({name: 'orderEmptyAlert'}));
          goBack();
        }}
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
  width: 80px;
  height: 80px;
  border-radius: 2px;
`;
const ArrowImage = styled.Image`
  align-self: center;
  margin-top: 28px;
  width: 20px;
  height: 20px;
`;
const TotalPrice = styled(TextMain)`
  margin-top: 16px;
  margin-right: 16px;
  font-size: 16px;
  font-weight: bold;
  align-self: flex-end;
`;

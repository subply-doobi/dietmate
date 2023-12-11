import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  ScrollView,
  Text,
} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

import {RootState} from '../../../stores/store';
import colors from '../../../styles/colors';
import {commaToNum, sumUpPrice} from '../../../util/sumUp';
import DeleteAlertContent from '../../../components/common/alert/DeleteAlertContent';
import DAlert from '../../../components/common/alert/DAlert';
import {
  TextMain,
  VerticalLine,
  Col,
  HorizontalLine,
  Row,
  TextSub,
  HorizontalSpace,
  BtnSmall,
  BtnSmallText,
} from '../../../styles/styledConsts';
import {BASE_URL} from '../../../query/queries/urls';
import MenuSection from '../../../components/common/menuSection/MenuSection';
import {icons} from '../../../assets/icons/iconSource';
import {
  useCreateDietDetail,
  useDeleteDietDetail,
  useListDietDetail,
} from '../../../query/queries/diet';
import {useListProduct} from '../../../query/queries/product';
import {IProductData} from '../../../query/types/product';
import {useListOrderDetail} from '../../../query/queries/order';
import {useNavigation, useRoute} from '@react-navigation/native';
import {IOrderedProduct} from '../../../query/types/order';
import {
  INQUIRY_URL,
  SERVICE_PRICE_PER_PRODUCT,
  SHIPPING_PRICE,
} from '../../../constants/constants';
import {link} from '../../../util/common/linking';

const OrderHistoryDetail = () => {
  // navigation
  const route = useRoute();
  const navigation = useNavigation();

  // redux
  const {applied: appliedSortFilter} = useSelector(
    (state: RootState) => state.sortFilter,
  );

  // orderDetailData => 주문한 상품들 끼니별 내역
  const {
    orderDetailData,
    totalPrice,
  }: {orderDetailData: IOrderedProduct[][]; totalPrice: number} = route?.params;
  const addMutation = useCreateDietDetail();
  const deleteMutation = useDeleteDietDetail();
  const nutrientType = ['calorie', 'carb', 'protein', 'fat'];
  const {currentDietNo} = useSelector((state: RootState) => state.common);
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);
  const {data: useListProductData} = useListProduct({
    dietNo: currentDietNo,
    appliedSortFilter,
  });

  const isSelfOrder = orderDetailData[0][0]?.orderTypeCd === 'SP011001';

  // const {data: orderDetailData, isLoading} = useListOrderDetail(orderNo);
  const isAdded = useListProductData?.filter(
    item => item.productChoiceYn === 'Y',
  );
  useEffect(() => {
    orderDetailData &&
      navigation.setOptions({
        title: orderDetailData[0][0]?.buyDate,
      });
  }, []);
  const getNutrient = (arg: any, type: any) => {
    let nutrient = [];
    for (let i = 0; i < orderDetailData.length; i++) {
      let nutrientSum = 0;
      for (let j = 0; j < orderDetailData[i].length; j++) {
        nutrientSum += parseInt(arg[i][j][type]);
      }
      nutrient.push(nutrientSum);
    }
    return nutrient;
  };
  const getTotalPrice = (arg: any) => {
    let dietTotalPrice = [];
    for (let i = 0; i < orderDetailData?.length; i++) {
      let priceSum = 0;
      for (let j = 0; j < arg[i]?.length; j++) {
        priceSum += parseInt(arg[i][j]?.price);
      }
      dietTotalPrice.push(priceSum);
    }
    return dietTotalPrice;
  };
  const nutrientTypeToKorean = (arg: String) => {
    switch (arg) {
      case 'calorie':
        return '칼로리';
      case 'carb':
        return '탄수화물';
      case 'protein':
        return '단백질';
      case 'fat':
        return '지방';
    }
  };
  const onAdd = (item: IProductData) => {
    addMutation.mutate({dietNo: currentDietNo, food: item});
  };
  const onDelete = (item: IProductData) => {
    deleteMutation.mutate({
      dietNo: currentDietNo,
      productNo: item?.productNo,
    });
    setDeleteAlertShow(false);
  };
  //끼니별로 나눠져있는 productData 하나의 배열로 합치기
  const newProductData = orderDetailData?.reduce((acc, cur) => {
    return acc.concat(cur);
  }, []);
  //newProductData에서 platformNm이 같은 것들끼리 묶기
  const groupByPlatformNm = newProductData.reduce((acc, cur) => {
    const key = cur.platformNm;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(cur);
    return acc;
  }, {});
  const groupByPlatformNmArray = Object.keys(groupByPlatformNm).map(key => {
    return groupByPlatformNm[key];
  });

  //groupByPlatformNmArray에서 같은 platformNm별로 총 price 구하기
  const getPriceFromPlatformNm = groupByPlatformNmArray.map(item => {
    return item.reduce((acc, cur) => {
      return (
        acc +
        (parseInt(cur.price) + SERVICE_PRICE_PER_PRODUCT) * parseInt(cur.qty)
      );
    }, 0);
  });

  return (
    <Container>
      <MenuSection />
      <ScrollView>
        <InquireBtn onPress={() => link(INQUIRY_URL)}>
          <BtnSmallText>문의하기</BtnSmallText>
        </InquireBtn>
        <ContentContainer>
          {orderDetailData.map((menu: IOrderedProduct[], menuIdx: number) => (
            <Card key={menuIdx}>
              <CardTitle>
                끼니 {menuIdx + 1}{' '}
                <CardTitle style={{color: colors.textSub}}>
                  (x{menu[0]?.qty}개)
                </CardTitle>
              </CardTitle>
              <MenuNutrContainer>
                {nutrientType.map((nutrient, index) => (
                  <Row key={index} style={{flex: 1, height: '100%'}}>
                    <Col style={{flex: 1, alignItems: 'center'}}>
                      <MenuNutr>{nutrientTypeToKorean(nutrient)}</MenuNutr>
                      <MenuNutrValue>
                        {getNutrient(orderDetailData, nutrient)[menuIdx]}
                        {nutrient === 'calorie' ? ' kcal' : ' g'}
                      </MenuNutrValue>
                    </Col>
                    {nutrientType.length - 1 !== index && <VerticalLine />}
                  </Row>
                ))}
              </MenuNutrContainer>
              {menu.map((item, thumbnailIndex: number) => (
                <Col key={thumbnailIndex} style={{marginTop: 24}}>
                  <Row style={{alignItems: 'flex-start'}}>
                    <ThumbnailImage
                      source={{uri: `${BASE_URL}${item?.mainAttUrl}`}}
                    />
                    <Col
                      style={{
                        marginLeft: 8,
                        flex: 1,
                      }}>
                      <MakeVertical>
                        <SellerText>{item.platformNm}</SellerText>
                        <ProductNmText numberOfLines={1} ellipsizeMode="tail">
                          {item.productNm}
                        </ProductNmText>
                        <NutrientText numberOfLines={1} ellipsizeMode="tail">
                          칼{' '}
                          <NutrientValue>
                            {parseInt(item.calorie)}kcal
                          </NutrientValue>
                          {'    '}탄{' '}
                          <NutrientValue>{parseInt(item.carb)}g</NutrientValue>
                          {'    '}단{' '}
                          <NutrientValue>
                            {parseInt(item.protein)}g
                          </NutrientValue>
                          {'    '}지{' '}
                          <NutrientValue>{parseInt(item.fat)}g</NutrientValue>
                        </NutrientText>
                      </MakeVertical>
                      {isAdded?.find(
                        arg => arg.productNo === item.productNo,
                      ) ? (
                        <DeleteBtn
                          onPress={() => {
                            setDeleteAlertShow(true);
                            onDelete(item);
                          }}>
                          <DeleteImage source={icons.cancelRound_24} />
                        </DeleteBtn>
                      ) : (
                        <PlusBtn
                          onPress={() => {
                            onAdd(item);
                          }}>
                          <PlusImage source={icons.plusRoundSmall_24} />
                        </PlusBtn>
                      )}
                    </Col>
                  </Row>

                  {isSelfOrder ? (
                    <OrderLinkBtn onPress={() => Linking.openURL(item.link2)}>
                      <OrderLinkText>구매링크</OrderLinkText>
                    </OrderLinkBtn>
                  ) : (
                    <ProductPrice>
                      {commaToNum(
                        parseInt(item.price) + SERVICE_PRICE_PER_PRODUCT,
                      )}
                      원
                    </ProductPrice>
                  )}

                  <HorizontalLine />
                </Col>
              ))}
              {isSelfOrder ? (
                <SelfOrderTextBox>
                  <SelfOrderText>직접 구매한 식단</SelfOrderText>
                </SelfOrderTextBox>
              ) : (
                <TotalPrice>{commaToNum(sumUpPrice(menu, true))}원</TotalPrice>
              )}
            </Card>
          ))}
        </ContentContainer>

        {isSelfOrder || (
          <Col>
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

            <SummaryContainer>
              <SummaryTitle>결제수단</SummaryTitle>
              <SummaryPMText style={{color: colors.textSub}}>
                {orderDetailData[0][0]?.payMethod}
              </SummaryPMText>
            </SummaryContainer>
            {/* xx */}
            <SummaryContainer style={{paddingBottom: 24}}>
              <SummaryTitle>결제금액</SummaryTitle>
              <HorizontalSpace height={16} />
              {groupByPlatformNmArray.map((item, index) => (
                <Col key={index}>
                  <SummarySellerText>{item[0].platformNm}</SummarySellerText>
                  {getPriceFromPlatformNm[index] && (
                    <SummaryPriceText>
                      {commaToNum(getPriceFromPlatformNm[index])}원
                    </SummaryPriceText>
                  )}
                </Col>
              ))}
              <ShippingPriceText>
                배송비: {commaToNum(SHIPPING_PRICE)}원
              </ShippingPriceText>
              <PriceTotal style={{alignSelf: 'flex-end'}}>
                전체 합계: {commaToNum(totalPrice)}원
              </PriceTotal>
            </SummaryContainer>
          </Col>
        )}
      </ScrollView>
      {/* <DAlert
        alertShow={deleteAlertShow}
        confirmLabel="삭제"
        onConfirm={item => onDelete(item)}
        onCancel={() => {
          setDeleteAlertShow(false);
        }}
        renderContent={() => <DeleteAlertContent deleteText={'해당식품을'} />}
      /> */}
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

const ContentContainer = styled.View`
  flex: 1;
  padding: 0px 8px 24px 8px;
`;

const Card = styled.View`
  width: 100%;
  padding: 0px 8px 16px 8px;
  margin-top: 16px;
  background-color: ${colors.white};
  border-radius: 10px;
`;

const CardTitle = styled(TextMain)`
  margin-top: 16px;
  font-size: 18px;
  font-weight: bold;
  align-self: center;
`;

const MenuNutrContainer = styled(Row)`
  height: 40px;
  flex: 1;
  margin-top: 24px;
`;

const MenuNutr = styled(TextMain)`
  font-size: 12px;
`;

const MenuNutrValue = styled(TextMain)`
  font-size: 14px;
`;

const MakeVertical = styled.View`
  flex-direction: column;
`;

const PlusBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
`;
const PlusImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const ThumbnailImage = styled.Image`
  width: 72px;
  height: 72px;
  background-color: ${colors.highlight};
  border-radius: 3px;
`;

const SellerText = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

const DeleteBtn = styled.TouchableOpacity`
  position: absolute;
  right: 0px;
  top: 0px;
`;

const DeleteImage = styled.Image`
  width: 24px;
  height: 24px;
  background-color: ${colors.white};
`;

const ProductNmText = styled(TextMain)`
  font-size: 14px;
`;

const NutrientText = styled(TextSub)`
  margin-top: 4px;
  font-size: 12px;
`;
const NutrientValue = styled(TextMain)`
  font-size: 12px;
  font-weight: bold;
`;

const TotalPrice = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  align-self: flex-end;
  margin-top: 16px;
`;

const OrderLinkBtn = styled.TouchableOpacity`
  height: 24px;
  align-self: flex-end;
  margin-top: 12px;
  padding-right: 4px;
`;
const OrderLinkText = styled(TextMain)`
  font-size: 12px;
  color: ${colors.main};
`;

const ProductPrice = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-left: 80px;
  margin-bottom: 16px;
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

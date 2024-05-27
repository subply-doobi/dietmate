import {useEffect} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

import {RootState} from '../../app/store/reduxStore';
import colors from '../../shared/colors';
import {commaToNum, sumUpNutrients, sumUpPrice} from '../../shared/utils/sumUp';
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
} from '../../shared/ui/styledComps';
import {BASE_URL} from '../../shared/api/urls';
import MenuSection from '../../components/common/menuSection/MenuSection';
import {icons} from '../../shared/iconSource';
import {
  useCreateDietDetail,
  useDeleteDietDetail,
  useListDietTotalObj,
} from '../../shared/api/queries/diet';
import {IProductData} from '../../shared/api/types/product';
import {useNavigation, useRoute} from '@react-navigation/native';
import {IOrderedProduct} from '../../shared/api/types/order';
import {INQUIRY_URL, SERVICE_PRICE_PER_PRODUCT} from '../../shared/constants';
import {link} from '../../shared/utils/linking';
import {reGroupOrderBySeller} from '../../shared/utils/dataTransform';

const NUTRIENT_TYPE = [
  {id: 'calorie', label: '칼로리'},
  {id: 'carb', label: '탄수화물'},
  {id: 'protein', label: '단백질'},
  {id: 'fat', label: '지방'},
];

const OrderedMenu = ({menu}: {menu: IOrderedProduct[]}) => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.common);

  // react-query
  const {data: dTOData} = useListDietTotalObj();
  const dDData = dTOData?.[currentDietNo]?.dietDetail ?? [];
  const addMutation = useCreateDietDetail();
  const deleteMutation = useDeleteDietDetail();

  // etc
  const onAdd = (item: IProductData) => {
    addMutation.mutate({dietNo: currentDietNo, food: item});
  };
  const onDelete = (item: IProductData) => {
    deleteMutation.mutate({
      dietNo: currentDietNo,
      productNo: item?.productNo,
    });
  };

  return menu.map((item, thumbnailIndex: number) => (
    <Col key={thumbnailIndex} style={{marginTop: 24}}>
      <Row style={{alignItems: 'flex-start'}}>
        <ThumbnailImage source={{uri: `${BASE_URL}${item?.mainAttUrl}`}} />
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
              칼 <NutrientValue>{parseInt(item.calorie)}kcal</NutrientValue>
              {'    '}탄 <NutrientValue>{parseInt(item.carb)}g</NutrientValue>
              {'    '}단{' '}
              <NutrientValue>{parseInt(item.protein)}g</NutrientValue>
              {'    '}지 <NutrientValue>{parseInt(item.fat)}g</NutrientValue>
            </NutrientText>
          </MakeVertical>
          {dDData?.find(({productNo}) => productNo === item.productNo) ? (
            <DeleteBtn
              onPress={() => {
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
      <ProductPrice>
        {commaToNum(parseInt(item.price) + SERVICE_PRICE_PER_PRODUCT)}원
      </ProductPrice>

      <HorizontalLine />
    </Col>
  ));
};

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
        <ContentContainer>
          {orderDetailData.map((menu: IOrderedProduct[], menuIdx: number) => {
            const {cal, carb, protein, fat} = sumUpNutrients(menu);
            return (
              <Card key={menuIdx}>
                <CardTitle>
                  끼니 {menuIdx + 1}{' '}
                  <CardTitle style={{color: colors.textSub}}>
                    (x{menu[0]?.qty}개)
                  </CardTitle>
                </CardTitle>

                {/* 해당 끼니 영양성분 */}
                <MenuNutrContainer>
                  {NUTRIENT_TYPE.map((nutrient, index) => (
                    <Row key={index} style={{flex: 1, height: '100%'}}>
                      <Col style={{flex: 1, alignItems: 'center'}}>
                        <MenuNutr>{nutrient.label}</MenuNutr>
                        <MenuNutrValue>
                          {[cal, carb, protein, fat][index]}
                          {nutrient.id === 'calorie' ? ' kcal' : ' g'}
                        </MenuNutrValue>
                      </Col>
                      {NUTRIENT_TYPE.length - 1 !== index && <VerticalLine />}
                    </Row>
                  ))}
                </MenuNutrContainer>

                {/* 해당 끼니 식품 */}
                <OrderedMenu menu={menu} />

                {isSelfOrder ? (
                  <SelfOrderTextBox>
                    <SelfOrderText>직접 구매한 식단</SelfOrderText>
                  </SelfOrderTextBox>
                ) : (
                  <TotalPrice>
                    {commaToNum(sumUpPrice(menu, true))}원
                  </TotalPrice>
                )}
              </Card>
            );
          })}
        </ContentContainer>

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

const ContentContainer = styled.View`
  flex: 1;
  padding: 0px 8px 24px 8px;
`;

const Card = styled.View`
  width: 100%;
  padding: 8px 8px 32px 8px;
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

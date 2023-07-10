import React, {useEffect, useState} from 'react';
import {FlatList, ScrollView} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

import {RootState} from '../stores/store';
import colors from '../styles/colors';
import {commaToNum} from '../util/sumUp';
import DeleteAlertContent from '../components/common/alert/DeleteAlertContent';
import DAlert from '../components/common/alert/DAlert';

import {NavigationProps} from '../constants/constants';
import {
  TextMain,
  VerticalLine,
  Col,
  HorizontalLine,
  Row,
  TextSub,
} from '../styles/StyledConsts';
import {BASE_URL} from '../query/queries/urls';
import MenuSection from '../components/common/menuSection/MenuSection';
import {icons} from '../assets/icons/iconSource';
import {
  useCreateDietDetail,
  useDeleteDietDetail,
  useListDietDetail,
} from '../query/queries/diet';
import {useListProduct} from '../query/queries/product';
import {IProductData} from '../query/types/product';

const PaymentDetail = props => {
  const {productData, totalPrice} = props?.route?.params;
  const addMutation = useCreateDietDetail();
  const deleteMutation = useDeleteDietDetail();
  const nutrientType = ['calorie', 'carb', 'protein', 'fat'];
  const {currentDietNo} = useSelector((state: RootState) => state.cart);
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);
  const {data: dietDetailData} = useListDietDetail(currentDietNo, {
    enabled: currentDietNo ? true : false,
  });
  const {data: useListProductData} = useListProduct({
    dietNo: currentDietNo,
  });
  const isAdded = useListProductData?.filter(
    item => item.productChoiceYn === 'Y',
  );
  const getNutrient = (arg: any, type: any) => {
    let nutrient = [];
    for (let i = 0; i < productData.length; i++) {
      let nutrientSum = 0;
      for (let j = 0; j < productData[i].length; j++) {
        nutrientSum += parseInt(arg[i][j][type]);
      }
      nutrient.push(nutrientSum);
    }
    return nutrient;
  };
  const getTotalPrice = (arg: any) => {
    let dietTotalPrice = [];
    for (let i = 0; i < productData?.length; i++) {
      let priceSum = 0;
      for (let j = 0; j < arg[i]?.length; j++) {
        priceSum += parseInt(arg[i][j]?.price);
      }
      dietTotalPrice.push(priceSum);
    }
    return dietTotalPrice;
  };
  const nutrientTypeToKorean = (arg: String[]) => {
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
  const newProductData = productData?.reduce((acc, cur) => {
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
      return acc + parseInt(cur.price);
    }, 0);
  });
  console.log(getPriceFromPlatformNm);

  return (
    <Container>
      <MenuSection />
      <ScrollView>
        <ContentContainer>
          {productData.map((product: IProductData, productIndex: number) => (
            <Card key={productIndex}>
              <CardTitle>끼니 {productIndex + 1}</CardTitle>
              <MenuNutrContainer>
                {nutrientType.map((nutrient, index) => (
                  <Col key={index}>
                    <Row>
                      <MakeVertical>
                        <MenuNutr>{nutrientTypeToKorean(nutrient)}</MenuNutr>
                        <MenuNutrValue>
                          {getNutrient(productData, nutrient)[productIndex]}
                          {nutrient === '칼로리' ? 'kcal' : 'g'}
                        </MenuNutrValue>
                      </MakeVertical>
                      <VerticalLine style={{margin: 20}} />
                    </Row>
                  </Col>
                ))}
              </MenuNutrContainer>
              {product.map((item: IProductData, thumbnailIndex: number) => (
                <Col key={thumbnailIndex}>
                  <Row>
                    <ThumbnailImage
                      source={{uri: `${BASE_URL}${item?.mainAttUrl}`}}
                    />
                    <Col style={{marginLeft: 8, flex: 1}}>
                      <MakeVertical>
                        <SellerText>{item.platformNm}</SellerText>
                        <ProductNmText numberOfLines={1} ellipsizeMode="tail">
                          {item.productNm}
                        </ProductNmText>
                        <NutrientText>
                          칼로리{' '}
                          <NutrientValue>
                            {parseInt(item.calorie)}kcal{' '}
                          </NutrientValue>
                          탄수화물{' '}
                          <NutrientValue>{parseInt(item.carb)}g </NutrientValue>
                          단백질{' '}
                          <NutrientValue>
                            {parseInt(item.protein)}g{' '}
                          </NutrientValue>
                          지방{' '}
                          <NutrientValue>{parseInt(item.fat)}g </NutrientValue>
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
                          <PlusImage source={icons.plusRound_24} />
                        </PlusBtn>
                      )}
                    </Col>
                  </Row>
                  <ProductPrice>{commaToNum(item.price)}원</ProductPrice>
                  <HorizontalLine />
                </Col>
              ))}
              <TotalPrice>
                {getTotalPrice(productData)[productIndex]}원
              </TotalPrice>
            </Card>
          ))}
        </ContentContainer>
        <SummaryContainer>
          <SummaryMainText>배송지</SummaryMainText>
          <SummarySubText>서울시 강남구 테헤란로 427</SummarySubText>
        </SummaryContainer>
        <SummaryContainer>
          <SummaryMainText>결제수단</SummaryMainText>
          <SummarySubText>카카오페이</SummarySubText>
        </SummaryContainer>
        <SummaryContainer style={{marginBottom: 100}}>
          <SummaryMainText>결제금액</SummaryMainText>
          {groupByPlatformNmArray.map((item, index) => (
            <Col key={index}>
              <SummarySubText>{item[0].platformNm}</SummarySubText>
              {getPriceFromPlatformNm[index] && (
                <SummarySubText>
                  식품: {commaToNum(getPriceFromPlatformNm[index])}원
                </SummarySubText>
              )}
            </Col>
          ))}
          <SummaryMainText style={{alignSelf: 'flex-end'}}>
            전체 합계: {commaToNum(totalPrice)}원
          </SummaryMainText>
        </SummaryContainer>
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

export default PaymentDetail;

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundLight};
`;
const SummaryContainer = styled.View`
  flex: 1;
  background-color: ${colors.white};
  margin-top: 16px;
`;
const ProgressBox = styled.View`
  background-color: ${colors.white};
  padding: 0px 16px 0px 16px;
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
const SummaryMainText = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
  margin: 8px;
`;
const SummarySubText = styled(TextMain)`
  font-size: 14px;
  margin: 8px;
`;
const MenuNutrContainer = styled(Row)`
  margin: 30px
  width: 100%;
  align-items: center;
`;

const MenuNutr = styled(TextMain)`
  font-size: 12px;
  margin-right: 8px;
  align-self: center;
`;

const MenuNutrValue = styled(TextMain)`
  font-size: 14px;
  align-self: center;
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
const ProductPrice = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-left: 80px;
  margin-bottom: 16px;
`;

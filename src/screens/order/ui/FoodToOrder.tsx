import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

import {
  AccordionContentContainer,
  TextMain,
  Col,
  Row,
  HorizontalLine,
} from '../../../shared/ui/styledComps';
import colors from '../../../shared/colors';
import {commaToNum} from '../../../shared/utils/sumUp';

import {BASE_URL} from '../../../shared/api/urls';
import {
  useListDiet,
  useListDietDetail,
  useListDietDetailAll,
} from '../../../shared/api/queries/diet';
import {RootState} from '../../../app/store/reduxStore';

const FoodToOrder = () => {
  const {data: listDietDetailAll, isLoading: isListDietDetailLoading} =
    useListDietDetailAll();
  const {data: listDiet} = useListDiet();

  if (isListDietDetailLoading) {
    return <ActivityIndicator />;
  }
  return (
    <AccordionContentContainer>
      {listDiet?.map((diet, index) => {
        return (
          <Col key={`${diet.dietNo}-${index}`}>
            <FoodsInOneDiet dietNo={diet.dietNo} />
          </Col>
        );
      })}
    </AccordionContentContainer>
  );
};
interface FoodInOneDietProps {
  dietNo: string;
}
const FoodsInOneDiet = ({dietNo}: FoodInOneDietProps) => {
  const {data: listDietDetail, isLoading} = useListDietDetail(dietNo);
  const {data: listDiet} = useListDiet();
  //redux
  const {foodToOrder} = useSelector((state: RootState) => state.order);
  //useEffect

  if (isLoading) {
    return <ActivityIndicator />;
  }
  function getDietSeq(dietArr, dietNo) {
    for (let i = 0; i < dietArr.length; i++) {
      if (dietArr[i].dietNo === dietNo) {
        return dietArr[i]?.dietSeq + `  (x${foodToOrder[i][0]?.qty}개)`;
      }
    }
    return null; // 만약 해당하는 dietNo를 찾을 수 없을 경우 null 반환
  }
  const dietSeq = getDietSeq(listDiet, dietNo);

  return (
    <>
      <Col>
        {listDietDetail?.length ? (
          <View>
            <MenuTitle>{dietSeq}</MenuTitle>
            <HorizontalLine
              style={{marginTop: 8, backgroundColor: colors.line}}
            />
          </View>
        ) : null}

        {listDietDetail?.map((product, index) => {
          return (
            <View key={`${product.productNo}-${index}`}>
              <SellerText numberOfLines={1} ellipsizeMode="tail">
                {product.platformNm}
              </SellerText>
              <Row style={{marginTop: 16}}>
                <FoodThumbnail
                  source={{
                    uri: `${BASE_URL}${product.mainAttUrl}`,
                  }}
                />
                <Col style={{flex: 1, marginLeft: 8}}>
                  <ProductName numberOfLines={1} ellipsizeMode="tail">
                    {product.productNm}
                  </ProductName>
                  <Row
                    style={{
                      marginTop: 8,
                      justifyContent: 'space-between',
                    }}>
                    <PriceAndQuantity>
                      {commaToNum(product.price)}원
                    </PriceAndQuantity>
                  </Row>
                </Col>
              </Row>
            </View>
          );
        })}
      </Col>
    </>
  );
};

export default FoodToOrder;

const MenuTitle = styled(TextMain)`
  margin-top: 16px;
  font-size: 16px;
  font-weight: bold;
`;

const FoodThumbnail = styled.Image`
  width: 64px;
  height: 64px;
  border-radius: 5px;
`;

const SellerText = styled(TextMain)`
  margin-top: 24px;
  font-size: 14px;
`;

const ProductName = styled(TextMain)`
  font-size: 12px;
`;

const QuantityBox = styled.View`
  width: 80px;
  height: 24px;
`;

const PriceAndQuantity = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;

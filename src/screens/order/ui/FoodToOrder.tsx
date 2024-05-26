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
  HorizontalSpace,
} from '../../../shared/ui/styledComps';
import colors from '../../../shared/colors';
import {commaToNum} from '../../../shared/utils/sumUp';

import {BASE_URL} from '../../../shared/api/urls';
import {RootState} from '../../../app/store/reduxStore';

const FoodToOrder = () => {
  // redux
  const {foodToOrder} = useSelector((state: RootState) => state.order);

  if (!foodToOrder) {
    return <ActivityIndicator />;
  }
  return (
    <AccordionContentContainer>
      {foodToOrder &&
        Object.keys(foodToOrder).map((dietNo, index) => {
          return (
            <Col key={`${dietNo}-${index}`}>
              <FoodsInOneDiet dietNo={dietNo} />
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
  //redux
  const {foodToOrder} = useSelector((state: RootState) => state.order);
  const dDData = foodToOrder?.[dietNo]?.dietDetail ?? [];

  if (!foodToOrder) {
    return <ActivityIndicator />;
  }

  return (
    <Col>
      {foodToOrder && (
        <View>
          <MenuTitle>{`${foodToOrder?.[dietNo]?.dietSeq ?? ''}  ( x${foodToOrder[dietNo].dietDetail[0]?.qty}개 )`}</MenuTitle>
          <HorizontalLine
            style={{marginTop: 8, backgroundColor: colors.line}}
          />
        </View>
      )}

      {dDData?.map((product, index) => {
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
  );
};

export default FoodToOrder;

const MenuTitle = styled(TextMain)`
  font-size: 16px;
  line-height: 20px;
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

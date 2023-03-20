import React from 'react';
import styled from 'styled-components/native';
import colors from '../../styles/colors';
import {Col, Row, TextMain, TextSub} from '../../styles/styledConsts';
import {BASE_URL} from '../../query/queries/urls';
import {hasProduct} from '../../util/reduxUtil';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../stores/store';
import {PayloadAction} from '@reduxjs/toolkit';
import {SCREENWIDTH} from '../../constants/constants';
import {deleteLikeFood} from '../../stores/slices/likeSlice';
import {icons} from '../../assets/icons/iconSource';

const Container = styled.View``;

const Thumbnail = styled.Image`
  width: 100px;
  height: 100px;
  /* background-color: ${colors.highlight}; */
`;

const ProductInfoContainer = styled.View`
  flex: 1;
  height: 100px;
  margin-left: 16px;
  justify-content: space-between;
  /* background-color: ${colors.highlight}; */
`;

const NutrSummaryContainer = styled.View`
  flex-direction: row;
  width: 100%;
  height: 22px;
  border-radius: 5px;
  margin-top: 10px;
  padding: 3px 8px 3px 8px;
  justify-content: space-between;
  background-color: ${colors.bgBox};
`;

const SellerText = styled(TextMain)`
  font-size: 14px;
  font-weight: bold;
`;

const ProductName = styled(TextMain)`
  margin-top: 4px;
  font-size: 14px;
`;

const Price = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;

const Nutr = styled.View`
  flex-direction: row;
  width: ${(SCREENWIDTH - 16) / 5}px;
`;

const NutrText = styled(TextSub)`
  font-size: 12px;
`;

const NutrValue = styled(TextMain)`
  font-size: 12px;
`;

const AddOrDeleteBtn = styled.TouchableOpacity`
  align-self: flex-end;
  background-color: ${colors.highlight};
`;

const AddToCartBtnImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const DeleteLikeFoodBtn = styled.TouchableOpacity`
  width: 48px;
  height: 24px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-radius: 5px;
  border-color: ${colors.inactivated};
`;
const DeleteLikeFoodBtnText = styled(TextSub)`
  font-size: 14px;
`;

interface IFoodList {
  item: {
    item: {
      [key: string]: string;
    };
  };
  menuIndex: number;
}

const FoodList = ({item, menuIndex}: IFoodList) => {
  // const {cart} = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const itemExist = hasProduct(cart[menuIndex], item.item.productNo);
  const deleteFood = () => {
    console.log('deleteFood: productNo: ', item.item.productNo);
    dispatch(deleteLikeFood(item.item.productNo));
  };
  return (
    <Container>
      <Row>
        <Thumbnail
          source={{
            uri: `${BASE_URL}${item.item.mainAttUrl}`,
          }}
        />
        <ProductInfoContainer>
          <Col>
            <SellerText numberOfLines={1} ellipsizeMode="tail">
              {item.item?.platformNm}
            </SellerText>
            <ProductName numberOfLines={2} ellipsizeMode="tail">
              {item.item?.productNm}
            </ProductName>
          </Col>
          <Price>{item.item?.price}원</Price>
        </ProductInfoContainer>
        <Col
          style={{
            height: 100,
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <AddOrDeleteBtn
            onPress={() => {
              itemExist ? console.log('item삭제') : console.log('item추가');
            }}>
            {itemExist ? (
              <AddToCartBtnImage source={icons.minusRound_24} />
            ) : (
              <AddToCartBtnImage source={icons.plusRound_24} />
            )}
          </AddOrDeleteBtn>
          <DeleteLikeFoodBtn onPress={deleteFood}>
            <DeleteLikeFoodBtnText>삭제</DeleteLikeFoodBtnText>
          </DeleteLikeFoodBtn>
        </Col>
      </Row>
      <NutrSummaryContainer>
        <Nutr>
          <NutrText>칼로리</NutrText>
          <NutrValue> {parseInt(item.item.calorie)}</NutrValue>
        </Nutr>
        <Nutr>
          <NutrText>탄수화물</NutrText>
          <NutrValue> {parseInt(item.item.carb)}</NutrValue>
        </Nutr>
        <Nutr>
          <NutrText>단백질</NutrText>
          <NutrValue> {parseInt(item.item.protein)}</NutrValue>
        </Nutr>
        <Nutr>
          <NutrText>지방</NutrText>
          <NutrValue> {parseInt(item.item.fat)}</NutrValue>
        </Nutr>
      </NutrSummaryContainer>
    </Container>
  );
};

export default FoodList;

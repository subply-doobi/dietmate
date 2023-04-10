// react, RN, 3rd
import React, {useCallback, useState} from 'react';
import {FlatList} from 'react-native';
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';

// doobi util, redux, etc
import {RootState} from '../stores/store';
import {FOOD_LIST_ITEM_HEIGHT} from '../constants/constants';

// doobi Component
import {
  Container,
  HorizontalLine,
  Row,
  TextMain,
  TextSub,
} from '../styles/styledConsts';
import FoodList from '../components/home/FoodList';
import NutrientsProgress from '../components/common/nutrient/NutrientsProgress';

// react-query
import {IProductData} from '../query/types/product';

const Likes = () => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);

  // flatList render fn
  //  const renderFoodList = useCallback(
  //   ({item}: {item: IProductData}) =>
  //     dietDetailData ? <FoodList item={item} screen="LikeScreen" /> : <></>,
  //   [],
  // );
  // const extractListKey = useCallback(
  //   (item: IProductData) => item.productNo,
  //   [],
  // );
  // const getItemLayout = useCallback(
  //   (_: any, index: number) => ({
  //     length: FOOD_LIST_ITEM_HEIGHT,
  //     offset: FOOD_LIST_ITEM_HEIGHT * index,
  //     index,
  //   }),
  //   [],
  // );
  return (
    <Container>
      <NutrientsProgress currentDietNo={currentDietNo} />
      <Row style={{marginTop: 32}}>
        <ListTitle>찜한 상품</ListTitle>
        <NoOfFoods>{'XX 개'}</NoOfFoods>
      </Row>
      <HorizontalLine style={{marginTop: 8}} />
      {/* <FlatList
            data={tData}
            keyExtractor={extractListKey}
            renderItem={renderFoodList}
            getItemLayout={getItemLayout}
            // ItemSeparatorComponent={getSeperator}
            initialNumToRender={5}
            windowSize={2}
            maxToRenderPerBatch={7}
            removeClippedSubviews={true}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            refreshing={productIsFetching}
            onRefresh={refetchProduct}
          /> */}
    </Container>
  );
};

export default Likes;

const MenuSelectContainer = styled.View`
  width: 100%;
  height: 48px;
  justify-content: center;
`;

const ListTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
`;

const NoOfFoods = styled(TextSub)`
  font-size: 16px;
`;

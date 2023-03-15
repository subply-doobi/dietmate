import React, {useState} from 'react';
import styled from 'styled-components/native';
import {
  Row,
  HorizontalLine,
  BtnCTA,
  BtnBottomCTA,
  TextMain,
} from '../../../styles/styledConsts';
import {useWeightPurposeCode, useFilterCode} from '../../query/queries/code';
import {useListProduct} from '../../../query/queries/product';
import {
  useListCategory,
  useCountCategory,
} from '../../../query/queries/category';
import {ProgressBarAndroidComponent, ScrollView} from 'react-native';
import DSlider from '../common/slider/DSlider';

interface CategoryItem {
  categoryCd: string;
  CategoryCdNm: string;
  productCnt: number;
}
const CategoryContent = () => {
  // const filter = useFilterCode('Protein');
  // console.log('filterTest:', filter);
  // const list = useListProduct();
  // console.log('filterModal/listproduct:', list);
  const count = useCountCategory();
  const onPress = arg => {
    console.log('pressed', arg);
  };

  return (
    <>
      {count.data?.map((e, i) => (
        <>
          <CategoryButton
            key={e.categoryCd}
            onPress={() => onPress(e.categoryCd)}>
            <CategoryText>
              {e.categoryCdNm}( {e.productCnt})
            </CategoryText>
            <HorizontalLine />
          </CategoryButton>
        </>
      ))}
    </>
  );
};

export default CategoryContent;
const Text = styled.Text`
  font-size: 18px;
  margin: 15px;
`;
const CategoryText = styled.Text`
  font-size: 16px;
  margin: 15px;
  text-align: center;
`;
const CategoryButton = styled.TouchableOpacity``;

const BottomText = styled.Text`
  font-size: 16px;
`;
const Button = styled.TouchableOpacity``;
const Image = styled.Image`
  width: 24px;
  height: 24px;
`;
const FilterRow = styled(Row)`
  justify-content: center;
`;
const BottomRow = styled.View`
  flex-direction: row;
  justify-content: center;
`;
const SliderTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  margin-top: 40px;
`;
const MODAL_WIDTH = 328;
const MODAL_INNER_WIDTH = MODAL_WIDTH - 32;
const SLIDER_WIDTH = MODAL_INNER_WIDTH - 32;

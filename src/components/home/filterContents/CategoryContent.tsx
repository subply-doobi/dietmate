import React, {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {
  Row,
  HorizontalLine,
  BtnCTA,
  BtnBottomCTA,
  TextMain,
} from '../../../styles/styledConsts';
import {useDispatch, useSelector} from 'react-redux';

import {useWeightPurposeCode, useFilterCode} from '../../query/queries/code';
import {useListProduct} from '../../../query/queries/product';
import {
  useListCategory,
  useCountCategory,
} from '../../../query/queries/category';
import colors from '../../../styles/colors';
import {ProgressBarAndroidComponent, ScrollView} from 'react-native';
import DSlider from '../common/slider/DSlider';

import {setFilterParam} from '../../../stores/slices/filterSlice';

interface CategoryItem {
  categoryCd: string;
  CategoryCdNm: string;
  productCnt: number;
}
const CategoryContent = props => {
  const {setCategoryParam, categoryParam} = props;
  const dispatch = useDispatch();
  // const filter = useFilterCode('Protein');
  // console.log('filterTest:', filter);
  // const list = useListProduct();
  // console.log('filterModal/listproduct:', list);
  const [clicked, setClicked] = useState('');
  const count = useCountCategory();
  const Contents = () => {
    return count.data?.map((e, i) => (
      <CategoryButton
        key={e.categoryCd}
        onPress={() => {
          // setClicked(e.categoryCd);
          setCategoryParam(e.categoryCd);
          // dispatch(setFilterParam(e.categoryCd));
        }}>
        <CategoryText id={e.categoryCd} clicked={categoryParam}>
          {e.categoryCdNm}( {e.productCnt})
        </CategoryText>
        <HorizontalLine />
      </CategoryButton>
    ));
  };
  return (
    <>
      <Contents />
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
color: ${({id, clicked}) => (id === clicked ? colors.main : colors.textSub)}
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

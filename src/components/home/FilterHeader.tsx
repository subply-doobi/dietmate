import React from 'react';
import styled from 'styled-components/native';

import {Row, TextMain} from '../../styles/StyledConsts';
import colors from '../../styles/colors';
import {RootState} from '../../stores/store';
import {useListDietDetail} from '../../query/queries/diet';
import {useSelector} from 'react-redux';
import {useGetBaseLine} from '../../query/queries/baseLine';
import {IProductsData} from '../../query/types/product';
import {filterAvailableFoods} from '../../util/home/filterAvailableFoods';

interface IFilterHeader {
  onPress: () => void;
  setFilterIndex: React.Dispatch<React.SetStateAction<number>>;
  filterParams: {
    categoryParam?: string;
    nutritionParam?: {
      calorieParam?: [number, number];
      carbParam?: [number, number];
      fatParam?: [number, number];
      proteinParam?: [number, number];
    };
    priceParam?: [number, number];
  };
  filterHeaderText: string;
  setRemainNutrProductData: React.Dispatch<
    React.SetStateAction<IProductsData | undefined>
  >;
}

const FilterHeader = (props: IFilterHeader) => {
  // redux
  const {currentDietNo, totalFoodList} = useSelector(
    (state: RootState) => state.cart,
  );

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: dietDetailData} = useListDietDetail(currentDietNo, {
    enabled: currentDietNo ? true : false,
  });

  // etc
  const {
    onPress,
    setFilterIndex,
    filterParams,
    setRemainNutrProductData,
    filterHeaderText,
  } = props;

  return (
    <>
      <Row>
        <FilterBtn
          onPress={() => {
            onPress();
            setFilterIndex(0);
          }}>
          {filterParams.categoryParam ? (
            <>
              <FilterBtnText>{filterHeaderText}</FilterBtnText>
              <Badge />
            </>
          ) : (
            <FilterBtnText>카테고리</FilterBtnText>
          )}
        </FilterBtn>
        <FilterBtn
          onPress={() => {
            onPress();
            setFilterIndex(1);
          }}>
          {filterParams.nutritionParam?.calorieParam ||
          filterParams.nutritionParam?.carbParam ||
          filterParams.nutritionParam?.proteinParam ||
          filterParams.nutritionParam?.fatParam ? (
            <>
              <FilterBtnText>영양성분</FilterBtnText>
              <Badge />
            </>
          ) : (
            <FilterBtnText>영양성분</FilterBtnText>
          )}
        </FilterBtn>
        <FilterBtn
          onPress={() => {
            onPress();
            setFilterIndex(2);
          }}>
          {filterParams.priceParam ? (
            <>
              <FilterBtnText>가격</FilterBtnText>
              <Badge />
            </>
          ) : (
            <FilterBtnText>가격</FilterBtnText>
          )}
        </FilterBtn>
        <FilterBtn
          onPress={() => {
            baseLineData &&
              dietDetailData &&
              filterAvailableFoods(
                totalFoodList,
                baseLineData,
                dietDetailData,
                setRemainNutrProductData,
              );
          }}>
          <FilterBtnText>영양맞춤</FilterBtnText>
        </FilterBtn>
      </Row>
    </>
  );
};
export default FilterHeader;

const FilterBtn = styled.TouchableOpacity`
  margin-right: 36px;
`;
const FilterBtnText = styled(TextMain)`
  font-size: 14px;
`;
const Badge = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 8px;
  background-color: ${colors.main};
  position: absolute;
  top: 0px;
  right: -8px;
`;

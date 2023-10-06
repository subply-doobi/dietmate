import React, {SetStateAction, useState} from 'react';
import styled from 'styled-components/native';

import {Row, StyledProps, TextMain} from '../../styles/StyledConsts';
import colors from '../../styles/colors';
import {RootState} from '../../stores/store';
import {useListDietDetail} from '../../query/queries/diet';
import {useSelector} from 'react-redux';
import {useGetBaseLine} from '../../query/queries/baseLine';
import {IFilterParams, IProductsData} from '../../query/types/product';
import {icons} from '../../assets/icons/iconSource';
import {sumUpNutrients} from '../../util/sumUp';
import {NUTR_ERROR_RANGE} from '../../constants/constants';

interface IFilterHeader {
  onPress: () => void;
  setFilterIndex: React.Dispatch<React.SetStateAction<number>>;
  filterParams: {
    categoryParam: string;
    nutritionParam: {
      calorieParam: number[];
      carbParam: number[];
      fatParam: number[];
      proteinParam: number[];
    };
    priceParam: number[];
  };
  filterHeaderText: string;
  setFilterParams: React.Dispatch<SetStateAction<IFilterParams>>;
  setSortParam: React.Dispatch<SetStateAction<string>>;
  setSearchText: React.Dispatch<SetStateAction<string>>;
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
    setFilterParams,
    filterHeaderText,
    setSortParam,
    setSearchText,
  } = props;

  const onPressRemainNutrProduct = () => {
    const {cal, carb, protein, fat} = sumUpNutrients(dietDetailData);
    const calRemain = baseLineData
      ? parseInt(baseLineData?.calorie, 10) - cal
      : 0;
    const carbRemain = baseLineData
      ? parseInt(baseLineData?.carb, 10) - carb
      : 0;
    const proteinRemain = baseLineData
      ? parseInt(baseLineData?.protein, 10) - protein
      : 0;
    const fatRemain = baseLineData ? parseInt(baseLineData?.fat, 10) - fat : 0;
    setFilterParams(prev => ({
      ...prev,
      categoryParam: prev.categoryParam,
      priceParam: [...prev.priceParam],
      nutritionParam: {
        calorieParam: [0, calRemain + NUTR_ERROR_RANGE.calorie[1]],
        carbParam: [0, carbRemain + NUTR_ERROR_RANGE.carb[1]],
        proteinParam: [0, proteinRemain + NUTR_ERROR_RANGE.protein[1]],
        fatParam: [0, fatRemain + NUTR_ERROR_RANGE.fat[1]],
      },
    }));
  };
  const nutritionParams = filterParams.nutritionParam;
  const paramsToCheck = [
    nutritionParams.calorieParam,
    nutritionParams.carbParam,
    nutritionParams.proteinParam,
    nutritionParams.fatParam,
  ];

  const hasLengthTwo = paramsToCheck.some(param => param.length === 2);

  return (
    <>
      <Row style={{justifyContent: 'space-between'}}>
        <Row style={{columnGap: 8}}>
          <RemainNutrFilterBtn onPress={onPressRemainNutrProduct}>
            <FilterBtnText style={{color: 'white'}}>
              남은영양 이하
            </FilterBtnText>
          </RemainNutrFilterBtn>
          <FilterBtn
            onPress={() => {
              onPress();
              setFilterIndex(0);
            }}
            isActivated={filterParams.categoryParam ? true : false}>
            <FilterBtnText
              isActivated={filterParams.categoryParam ? true : false}>
              {filterParams.categoryParam ? filterHeaderText : '카테고리'}
            </FilterBtnText>
          </FilterBtn>
          <FilterBtn
            onPress={() => {
              onPress();
              setFilterIndex(1);
            }}
            isActivated={hasLengthTwo ? true : false}>
            <FilterBtnText isActivated={hasLengthTwo ? true : false}>
              영양성분
            </FilterBtnText>
          </FilterBtn>
          <FilterBtn
            onPress={() => {
              onPress();
              setFilterIndex(2);
            }}
            isActivated={filterParams.priceParam.length === 2 ? true : false}>
            <FilterBtnText
              isActivated={filterParams.priceParam.length === 2 ? true : false}>
              가격
            </FilterBtnText>
          </FilterBtn>
        </Row>
        <InitializeBtn
          onPress={() => {
            setFilterParams({
              categoryParam: '',
              nutritionParam: {
                calorieParam: [],
                carbParam: [],
                fatParam: [],
                proteinParam: [],
              },
              priceParam: [],
            });
            setSortParam('');
            setSearchText('');
          }}>
          <InitializeImg source={icons.initialize_24} />
        </InitializeBtn>
      </Row>
    </>
  );
};
export default FilterHeader;

const FilterBtn = styled.TouchableOpacity`
  height: 32px;
  padding: 6px 8px 6px 8px;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.dark : colors.inactivated};
  background-color: ${colors.white};
`;

const RemainNutrFilterBtn = styled.TouchableOpacity`
  height: 32px;
  padding: 6px 8px 6px 8px;
  border-radius: 5px;
  background-color: ${colors.dark};
`;

const FilterBtnText = styled(TextMain)`
  font-size: 14px;
  color: ${({isActivated}: StyledProps) =>
    isActivated ? colors.textMain : colors.textSub};
`;

const InitializeBtn = styled.TouchableOpacity`
  height: 32px;
  width: 24px;
  justify-content: center;
  align-items: center;
`;
const InitializeImg = styled.Image`
  width: 24px;
  height: 24px;
`;

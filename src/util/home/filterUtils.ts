import {SetStateAction} from 'react';
import {IProductsData} from '../../query/types/product';
import {getAvailableFoods} from '../cart/autoMenu';
import {IBaseLine} from '../../query/types/baseLine';
import {IDietDetailData} from '../../query/types/diet';
import {filterBtnRange} from '../../constants/constants';

export const filterAvailableFoods = (
  totalFoodList: IProductsData,
  baseLineData: IBaseLine,
  dietDetailData: IDietDetailData,
) => {
  // for 영양맞춤 필터
  const target = baseLineData
    ? [
        parseInt(baseLineData.calorie),
        parseInt(baseLineData.carb),
        parseInt(baseLineData.protein),
        parseInt(baseLineData.fat),
        14000,
      ]
    : [700, 96, 35, 19, 14000];
  const errorRange = {
    calorie: [-50, 50],
    carb: [-15, 15],
    protein: [-5, 5],
    fat: [-3, 3],
  };

  const availableFoods = dietDetailData
    ? getAvailableFoods({
        foods: totalFoodList,
        menu: dietDetailData,
        target,
        errorRange,
      })
    : [];

  return availableFoods;
};

const findRangeIdx = (
  calorieInitialState: (number | string)[],
  carbInitialState: (number | string)[],
  proteinInitialState: (number | string)[],
  fatInitialState: (number | string)[],
) => {
  const calorieIdx = calorieInitialState.every(v => v !== '')
    ? [
        filterBtnRange[0].value.findIndex(
          item => item[0] === calorieInitialState[0],
        ),
        filterBtnRange[0].value.findIndex(
          item => item[1] === calorieInitialState[1],
        ),
      ]
    : [];
  const carbIdx = carbInitialState.every(v => v !== '')
    ? [
        filterBtnRange[1].value.findIndex(
          item => item[0] === carbInitialState[0],
        ),
        filterBtnRange[1].value.findIndex(
          item => item[1] === carbInitialState[1],
        ),
      ]
    : [];
  const proteinIdx = proteinInitialState.every(v => v !== '')
    ? [
        filterBtnRange[2].value.findIndex(
          item => item[0] === proteinInitialState[0],
        ),
        filterBtnRange[2].value.findIndex(
          item => item[1] === proteinInitialState[1],
        ),
      ]
    : [];
  const fatIdx = fatInitialState.every(v => v !== '')
    ? [
        filterBtnRange[3].value.findIndex(
          item => item[0] === fatInitialState[0],
        ),
        filterBtnRange[3].value.findIndex(
          item => item[1] === fatInitialState[1],
        ),
      ]
    : [];
  return {
    calorie: calorieIdx,
    carb: carbIdx,
    protein: proteinIdx,
    fat: fatIdx,
  };
};

// TBD | filter type 지정
export const setInitialIdx = (filterParams: any, setNutrIdxRange: any) => {
  const calorieInitialState = [
    filterParams.nutritionParam?.calorieParam
      ? filterParams.nutritionParam?.calorieParam[0]
      : '',
    filterParams.nutritionParam?.calorieParam
      ? filterParams.nutritionParam?.calorieParam[1]
      : '',
  ];
  const carbInitialState = [
    filterParams.nutritionParam?.carbParam
      ? filterParams.nutritionParam?.carbParam[0]
      : '',
    filterParams.nutritionParam?.carbParam
      ? filterParams.nutritionParam?.carbParam[1]
      : '',
  ];
  const proteinInitialState = [
    filterParams.nutritionParam?.proteinParam
      ? filterParams.nutritionParam?.proteinParam[0]
      : '',
    filterParams.nutritionParam?.proteinParam
      ? filterParams.nutritionParam?.proteinParam[1]
      : '',
  ];
  const fatInitialState = [
    filterParams.nutritionParam?.fatParam
      ? filterParams.nutritionParam?.fatParam[0]
      : '',
    filterParams.nutritionParam?.fatParam
      ? filterParams.nutritionParam?.fatParam[1]
      : '',
  ];

  setNutrIdxRange(
    findRangeIdx(
      calorieInitialState,
      carbInitialState,
      proteinInitialState,
      fatInitialState,
    ),
  );
};

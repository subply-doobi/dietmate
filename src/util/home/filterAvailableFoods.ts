import {SetStateAction} from 'react';
import {IProductsData} from '../../query/types/product';
import {getAvailableFoods} from '../cart/autoMenu';
import {IBaseLine} from '../../query/types/baseLine';
import {IDietDetailData} from '../../query/types/diet';

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

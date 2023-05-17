import {UseQueryResult} from 'react-query';
import {NUTR_ERROR_RANGE} from '../constants/constants';
import {IBaseLine} from '../query/types/baseLine';
import {IDietDetailData} from '../query/types/diet';
import {IProductData} from '../query/types/product';

export const sumUpNutrients = (dietDetail: IDietDetailData | undefined) => {
  let cal = 0;
  let carb = 0;
  let protein = 0;
  let fat = 0;
  if (!dietDetail) {
    return {cal, carb, protein, fat};
  }
  for (let i = 0; i < dietDetail.length; i++) {
    cal += parseInt(dietDetail[i].calorie);
    carb += parseInt(dietDetail[i].carb);
    protein += parseInt(dietDetail[i].protein);
    fat += parseInt(dietDetail[i].fat);
  }
  return {cal, carb, protein, fat};
};

export const sumUpPrice = (dietDetail: IDietDetailData | undefined) => {
  if (!dietDetail) {
    return 0;
  }
  let price = 0;
  for (let i = 0; i < dietDetail.length; i++) {
    // TBD | 최소주문수량 지금은 다 1로 갈 것.
    // price += parseInt(dietDetail[i].price) * parseInt(dietDetail[i].qty);
    price += parseInt(dietDetail[i].price);
  }
  return price;
};

// TBD | MenuQty 도 같이 계산 필요
export const sumUpDietTotal = (
  dietDetailAllData: UseQueryResult<IDietDetailData, unknown>[],
) => {
  if (!dietDetailAllData || dietDetailAllData.length === 0) return 0;
  let menuNum = 0;
  let productNum = 0;
  let priceTotal = 0;
  for (let i = 0; i < dietDetailAllData.length; i++) {
    if (!dietDetailAllData[i]?.data) continue;
    menuNum += 1; // * menuQty
    for (let j = 0; j < dietDetailAllData[i].data.length; j++) {
      priceTotal += parseInt(dietDetailAllData[i]?.data[j].price); // * menuQty
      productNum += 1; // * menuQty
    }
  }
  return {menuNum, productNum, priceTotal};
};

export const getExceedIdx = (
  baseLineData: IBaseLine | undefined,
  cal: number,
  carb: number,
  protein: number,
  fat: number,
) => {
  const exceedArr = baseLineData
    ? [
        parseInt(baseLineData.calorie) + NUTR_ERROR_RANGE.calorie[1] < cal,
        parseInt(baseLineData.carb) + NUTR_ERROR_RANGE.carb[1] < carb,
        parseInt(baseLineData.protein) + NUTR_ERROR_RANGE.protein[1] < protein,
        parseInt(baseLineData.fat) + NUTR_ERROR_RANGE.fat[1] < fat,
      ]
    : [false, false, false, false];

  return exceedArr.indexOf(true);
};

export const checkNutrSatisfied = (
  baseLineData: IBaseLine | undefined,
  cal: number,
  carb: number,
  protein: number,
  fat: number,
) => {
  // TBD | 자동구성이랑 맞추려면. 일단 칼로리만 정확하게 맞추고 나머지는 넘지않게
  return baseLineData
    ? parseInt(baseLineData.calorie) + NUTR_ERROR_RANGE.calorie[0] <= cal &&
        parseInt(baseLineData.calorie) + NUTR_ERROR_RANGE.calorie[1] >= cal &&
        // parseInt(baseLineData.carb) + NUTR_ERROR_RANGE.carb[0] <= carb &&
        parseInt(baseLineData.carb) + NUTR_ERROR_RANGE.carb[1] >= carb &&
        // parseInt(baseLineData.protein) + NUTR_ERROR_RANGE.protein[0] <=
        //   protein &&
        parseInt(baseLineData.protein) + NUTR_ERROR_RANGE.protein[1] >=
          protein &&
        // parseInt(baseLineData.fat) + NUTR_ERROR_RANGE.fat[0] <= fat &&
        parseInt(baseLineData.fat) + NUTR_ERROR_RANGE.fat[1] >= fat
    : false;
};

export const makePriceObjBySeller = (
  productsBySeller: Array<Array<IProductData> | IDietDetailData>,
) => {
  let priceBySeller: {[key: string]: number} = {};
  for (let i = 0; i < productsBySeller.length; i++) {
    priceBySeller[productsBySeller[i][0]?.platformNm] = sumUpPrice(
      productsBySeller[i],
    );
  }
  return priceBySeller;
};

interface INutr {
  cal: number;
  carb: number;
  protein: number;
  fat: number;
}
export const compareNutrToTarget = (
  currentNutr: INutr | undefined,
  targetNutr: INutr | undefined,
): 'notEnough' | 'exceed' | 'empty' => {
  if (!currentNutr || !targetNutr) return 'empty';
  const {cal, carb, protein, fat} = currentNutr;
  const {cal: calT, carb: carbT, protein: proteinT, fat: fatT} = targetNutr;

  const current = [cal, carb, protein, fat];
  const target = [calT, carbT, proteinT, fatT];

  if (cal === 0 && carb === 0 && protein === 0 && fat === 0) {
    return 'empty';
  }

  let exceedNumber = 0;
  const indexToNutr = ['calorie', 'carb', 'protein', 'fat'];
  for (let i = 0; i < current.length; i++) {
    if (current[i] >= target[i] + NUTR_ERROR_RANGE[indexToNutr[i]][1])
      exceedNumber += 1;
  }

  return exceedNumber === 0 ? 'notEnough' : 'exceed';
};

export const reGroupBySeller = (dietDetailData: IDietDetailData) => {
  let reGroupedProducts: Array<IDietDetailData> = [[]];
  if (dietDetailData.length === 0) return undefined;
  for (let i = 0; i < dietDetailData.length; i++) {
    if (i === 0) {
      reGroupedProducts[0].push(dietDetailData[i]);
      continue;
    }
    let isNewSeller = true;
    for (let j = 0; j < reGroupedProducts.length; j++) {
      if (
        reGroupedProducts[j][0]?.platformNm === dietDetailData[i]?.platformNm
      ) {
        reGroupedProducts[j].push(dietDetailData[i]);
        isNewSeller = false;
        break;
      }
    }
    if (isNewSeller) {
      reGroupedProducts.push([dietDetailData[i]]);
    }
  }
  return reGroupedProducts;
};

export const commaToNum = (num: number | string) => {
  const n = typeof num === 'number' ? num.toString() : num;
  return n.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

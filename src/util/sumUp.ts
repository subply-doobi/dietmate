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
  dietDetail.forEach((food, index) => {
    cal += parseInt(food.calorie);
    carb += parseInt(food.carb);
    protein += parseInt(food.protein);
    fat += parseInt(food.fat);
  });
  return {cal, carb, protein, fat};
};

export const sumUpPrice = (dietDetail: IDietDetailData | undefined) => {
  if (!dietDetail) {
    return 0;
  }
  let price = 0;
  dietDetail?.forEach((food, index) => {
    price += parseInt(food.price) * parseInt(food.qty);
  });
  return price;
};
export const makePriceObjBySeller = (
  productsBySeller: Array<Array<IProductData> | IDietDetailData>,
) => {
  let priceBySeller: {[key: string]: number} = {};
  productsBySeller.forEach((seller, idx) => {
    priceBySeller[seller[0]?.platformNm] = sumUpPrice(seller);
  });
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
  current.forEach((v, idx) => {
    if (v >= target[idx]) exceedNumber += 1;
  });
  return exceedNumber === 0 ? 'notEnough' : 'exceed';
};

export const reGroupBySeller = (dietDetailData: IProductData[]) => {
  let reGroupedProducts: Array<Array<IProductData>> = [[]];
  for (let i = 0; i < dietDetailData.length; i++) {
    if (i === 0) {
      reGroupedProducts[0].push(dietDetailData[i]);
      continue;
    }
    for (let j = 0; j < reGroupedProducts.length; j++) {
      if (
        reGroupedProducts[j][0]?.platformNm === dietDetailData[i]?.platformNm
      ) {
        reGroupedProducts[j].push(dietDetailData[i]);
        break;
      } else {
        reGroupedProducts.push([dietDetailData[i]]);
        break;
      }
    }
  }
  return reGroupedProducts;
};

export const commaToNum = (num: number | string) => {
  const n = typeof num === 'number' ? num.toString() : num;
  return n.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

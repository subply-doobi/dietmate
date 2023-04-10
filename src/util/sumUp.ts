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
  for (let i = 0; i < current.length; i++) {
    if (current[i] >= target[i]) exceedNumber += 1;
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

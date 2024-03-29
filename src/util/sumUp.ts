import {
  NUTR_ERROR_RANGE,
  SERVICE_PRICE_PER_PRODUCT,
} from '../constants/constants';
import {IBaseLineData} from '../query/types/baseLine';
import {
  IDietDetailAllData,
  IDietDetailData,
  IDietTotalData,
} from '../query/types/diet';
import {IProductData} from '../query/types/product';
import {IOrderData, IOrderedProduct} from '../query/types/order';

export const sumUpNutrients = (
  dietDetail: IDietDetailData | IOrderData | undefined,
) => {
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

/** true | false 는 수량 고려할 것인지 */
export const sumUpPrice = (
  dietDetail: IDietDetailData | IOrderedProduct[] | undefined,
  qtyConsidered?: boolean | undefined,
) => {
  if (!dietDetail) {
    return 0;
  }
  let price = 0;
  for (let i = 0; i < dietDetail.length; i++) {
    let qty = qtyConsidered ? parseInt(dietDetail[i].qty) : 1;
    price += (parseInt(dietDetail[i].price) + SERVICE_PRICE_PER_PRODUCT) * qty;
  }
  return price;
};

export const sumUpDietTotal = (dietTotalData: IDietTotalData | undefined) => {
  let menuNum = 0;
  let productNum = 0;
  let priceTotal = 0;
  let shippingTotal = 0;
  if (!dietTotalData || dietTotalData.length === 0)
    return {menuNum, productNum, priceTotal, shippingTotal};
  for (let i = 0; i < dietTotalData.length; i++) {
    if (dietTotalData[i].length === 0) continue;
    menuNum += 1 * parseInt(dietTotalData[i][0].qty, 10);
    for (let j = 0; j < dietTotalData[i].length; j++) {
      priceTotal +=
        (parseInt(dietTotalData[i][j].price) + SERVICE_PRICE_PER_PRODUCT) *
        parseInt(dietTotalData[i][j].qty);
      productNum += parseInt(dietTotalData[i][j].qty);
      shippingTotal += parseInt(dietTotalData[i][j].shippingPrice);
    }
  }
  return {menuNum, productNum, priceTotal, shippingTotal};
};

export const getExceedIdx = (
  baseLineData: IBaseLineData | undefined,
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
  baseLineData: IBaseLineData | undefined,
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

/** 현재 영양과 목표영양을 비교해서  */
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
    if (current[i] > target[i] + NUTR_ERROR_RANGE[indexToNutr[i]][0])
      exceedNumber += 1;
  }

  return exceedNumber === 0 ? 'notEnough' : 'exceed';
};

export const sumUpPriceOfSeller = (
  dietDetailAllData: IDietDetailAllData | undefined,
  seller: string,
) => {
  if (!dietDetailAllData) return 0;
  // get sum of price by seller with reduce function
  return dietDetailAllData.reduce((acc, cur) => {
    return cur.platformNm === seller
      ? (parseInt(cur.price) + SERVICE_PRICE_PER_PRODUCT) * parseInt(cur.qty) +
          acc
      : acc;
  }, 0);
};

export const getSellerShippingPrice = (
  data: IDietDetailData | IOrderedProduct[] | undefined,
) => {
  let sellerPrice = 0;
  let sellerShippingText = '';
  let sellerShippingPrice = 0;

  if (data === undefined || data.length === 0)
    return {sellerPrice, sellerShippingText, sellerShippingPrice};

  for (let i = 0; i < data.length; i++) {
    sellerPrice +=
      (parseInt(data[i].price) + SERVICE_PRICE_PER_PRODUCT) *
      parseInt(data[i].qty);
  }

  if (sellerPrice >= parseInt(data[0].freeShippingPrice)) {
    sellerShippingText = '무료';
    sellerShippingPrice = 0;
    return {sellerPrice, sellerShippingText, sellerShippingPrice};
  }

  sellerShippingPrice = parseInt(data[0].shippingPrice);
  sellerShippingText = `${commaToNum(
    commaToNum(parseInt(data[0].shippingPrice)),
  )}원 (${commaToNum(
    parseInt(data[0].freeShippingPrice) - sellerPrice,
  )}원 더 담으면 무료배송)`;

  return {sellerPrice, sellerShippingText, sellerShippingPrice};
};

/** 배송비 전체 합계. seller별로 regrouped된 데이터를 parameter로 받음 */
export const getTotalShippingPrice = (
  data: IDietDetailData[] | IOrderedProduct[][] | undefined,
) => {
  let shippingPriceTotal = 0;
  if (data === undefined) return shippingPriceTotal;

  for (let i = 0; i < data.length; i++) {
    const {sellerShippingPrice} = getSellerShippingPrice(data[i]);
    shippingPriceTotal += sellerShippingPrice;
  }
  return shippingPriceTotal;
};

export const commaToNum = (num: number | string | undefined) => {
  if (!num) return '0';
  const n = typeof num === 'number' ? num.toString() : num;
  return n.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
};

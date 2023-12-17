import {IDietDetailAllData, IDietDetailData} from '../../query/types/diet';
import {IOrderData, IOrderedProduct} from '../../query/types/order';

export const reGroupBySeller = (
  dietDetailData: IDietDetailData | undefined,
) => {
  let reGroupedProducts: Array<IDietDetailData> = [[]];
  if (dietDetailData === undefined || dietDetailData.length === 0)
    return reGroupedProducts;
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

export const reGroupByDietNo = (
  dietDetailAllData: IDietDetailData | IDietDetailAllData | undefined,
) => {
  let reGroupedProducts: Array<IDietDetailData> = [[]];
  if (!dietDetailAllData || dietDetailAllData.length === 0)
    return reGroupedProducts;

  for (let i = 0; i < dietDetailAllData.length; i++) {
    if (i === 0) {
      reGroupedProducts[0].push(dietDetailAllData[i]);
      continue;
    }
    let isNewDietNo = true;
    for (let j = 0; j < reGroupedProducts.length; j++) {
      if (reGroupedProducts[j][0]?.dietNo === dietDetailAllData[i]?.dietNo) {
        reGroupedProducts[j].push(dietDetailAllData[i]);
        isNewDietNo = false;
        break;
      }
    }
    if (isNewDietNo) {
      reGroupedProducts.push([dietDetailAllData[i]]);
    }
  }
  return reGroupedProducts;
};

export const regroupByBuyDateAndDietNo = (
  orderData: IOrderData | undefined,
): IOrderedProduct[][][] => {
  if (!orderData) return [];

  const regrouped: IOrderedProduct[][][] = [];

  orderData.forEach(data => {
    const {buyDate, dietNo} = data;
    const buyDateIndex = regrouped.findIndex(
      group => group[0][0].buyDate === buyDate,
    );

    if (buyDateIndex === -1) {
      regrouped.push([[data]]);
    } else {
      const dietNoIndex = regrouped[buyDateIndex].findIndex(
        group => group[0].dietNo === dietNo,
      );

      if (dietNoIndex === -1) {
        regrouped[buyDateIndex].push([data]);
      } else {
        regrouped[buyDateIndex][dietNoIndex].push(data);
      }
    }
  });

  return regrouped;
};

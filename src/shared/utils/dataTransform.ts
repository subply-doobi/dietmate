import {
  IDietDetailData,
  IDietDetailProductData,
  IDietTotalObjData,
} from '../api/types/diet';
import {IOrderData, IOrderedProduct} from '../api/types/order';
import {IProductData} from '../api/types/product';

interface IRegroupedData {
  [key: string]: IProductData[];
}
export const regroupDDataBySeller = (dDData: IDietDetailData | undefined) =>
  !dDData
    ? {}
    : dDData.reduce((acc: IRegroupedData, cur) => {
        const key = cur.platformNm;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(cur);
        return acc;
      }, {});

export const reGroupOrderBySeller = (
  orderData: IOrderData | undefined,
): IOrderedProduct[][] => {
  let reGroupedProducts: Array<IOrderedProduct[]> = [[]];
  if (orderData === undefined || orderData.length === 0)
    return reGroupedProducts;
  for (let i = 0; i < orderData.length; i++) {
    if (i === 0) {
      reGroupedProducts[0].push(orderData[i]);
      continue;
    }
    let isNewSeller = true;
    for (let j = 0; j < reGroupedProducts.length; j++) {
      if (reGroupedProducts[j][0]?.platformNm === orderData[i]?.platformNm) {
        reGroupedProducts[j].push(orderData[i]);
        isNewSeller = false;
        break;
      }
    }
    if (isNewSeller) {
      reGroupedProducts.push([orderData[i]]);
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

export const reGroupBySellerFromDTOData = (
  dTOData: IDietTotalObjData | undefined,
) => {
  let regroupedBySeller: {
    [key: string]: IDietDetailData;
  } = {};
  if (!dTOData) return regroupedBySeller;
  const dietNoArr = Object.keys(dTOData);
  for (let dietNo of dietNoArr) {
    for (let p of dTOData[dietNo].dietDetail) {
      if (!regroupedBySeller[p.platformNm]) {
        regroupedBySeller[p.platformNm] = [p];
        continue;
      }
      const isExist = regroupedBySeller[p.platformNm].some(
        sp => sp.productNo === p.productNo,
      );
      if (!isExist) {
        regroupedBySeller[p.platformNm].push(p);
      } else {
        let productToMod = regroupedBySeller[p.platformNm].find(
          sp => sp.productNo === p.productNo,
        );
        if (productToMod) productToMod.qty += p.qty;
      }
    }
  }
  return regroupedBySeller;
};

export const tfDTOToDDA = (dTOData: IDietTotalObjData | undefined) => {
  if (!dTOData) return [];

  const productMap = new Map<string, IDietDetailProductData>();

  Object.values(dTOData).forEach(menu => {
    menu.dietDetail.forEach(p => {
      if (productMap.has(p.productNo)) {
        productMap.get(p.productNo)!.qty += p.qty;
      } else {
        productMap.set(p.productNo, {...p});
      }
    });
  });

  return Array.from(productMap.values());
};

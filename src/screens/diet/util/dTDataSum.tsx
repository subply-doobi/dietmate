import {UseQueryResult} from '@tanstack/react-query';
import {IDietDetailData} from '../../../shared/api/types/diet';
import {findEmptyDietSeq} from '../../../shared/utils/findDietSeq';
import {SERVICE_PRICE_PER_PRODUCT} from '../../../shared/constants';

export const getDTDataSum = (
  dietTotalData: UseQueryResult<IDietDetailData, Error>[],
) => {
  if (!dietTotalData) return;
  const dTData = dietTotalData.map((d, idx) => (d.data ? d.data : []));

  const menuNum = dTData.length;

  let productNum = 0;
  let totalPrice = 0;
  let totalShippingPrice = 0;

  const emptyDietSeq = findEmptyDietSeq(dTData);
  return {
    menuNum,
    productNum,
    totalPrice,
    totalShippingPrice,
    dTData,
    emptyDietSeq,
  };
};

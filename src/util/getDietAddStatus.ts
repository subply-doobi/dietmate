import {IDietData, IDietDetailEmptyYnData} from '../query/types/diet';

export const getDietAddStatus = (
  dietData: IDietData | undefined,
  dietEmptyData: IDietDetailEmptyYnData | undefined,
) => {
  return !dietData || !dietEmptyData
    ? 'noData'
    : dietData.length >= 10
    ? 'limit'
    : dietEmptyData.emptyYn === 'Y'
    ? 'empty'
    : 'possible';
};

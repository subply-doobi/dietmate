import {IDietData, IDietDetailEmptyYnData} from '../api/types/diet';

export const getDietAddStatus = (
  dietData: IDietData | undefined,
  dietEmptyData: IDietDetailEmptyYnData | undefined,
) => {
  return !dietData || !dietEmptyData
    ? 'noData'
    : dietData.length >= 5
      ? 'limit'
      : dietEmptyData.emptyYn === 'Y'
        ? 'empty'
        : 'possible';
};

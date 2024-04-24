import {
  IDietData,
  IDietDetailData,
  IDietDetailEmptyYnData,
} from '../api/types/diet';

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

export const getAddDietStatusFrDTData = (
  dTData: IDietDetailData[] | undefined,
) => {
  const hasEmptyMenu = dTData?.some(data => data.length === 0);
  const status = !dTData
    ? 'noData'
    : dTData.length >= 10
      ? 'limit'
      : hasEmptyMenu
        ? 'empty'
        : 'possible';

  const text =
    status === 'noData'
      ? '데이터가 없습니다.'
      : status === 'limit'
        ? '끼니는 최대 10개까지만\n추가할 수 있습니다.'
        : status === 'empty'
          ? '비어있는 끼니를 구성하고\n이용해보세요'
          : '추가 가능한\n끼니입니다.';

  return {status, text};
};

import {UseQueryResult} from '@tanstack/react-query';
import {IDietDetailData} from '../api/types/diet';

export const convertQsResultToData = (
  qResult: false | UseQueryResult<IDietDetailData, Error>[],
) => {
  const dTDataStatus =
    qResult && qResult.map(menu => menu.isLoading).includes(true)
      ? 'isLoading'
      : 'isSuccess';

  const dTData =
    qResult && dTDataStatus === 'isSuccess'
      ? qResult?.map((d, idx) => (d.data ? d.data : []))
      : undefined;

  return {dTDataStatus, dTData};
};

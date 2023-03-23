import {useQuery} from '@tanstack/react-query';
import {queryFn} from './requestFn';
import {
  DIET_PURPOSE_CODE,
  WEIGHT_PURPOSE_CODE,
  AEROBIC_PURPOSE_CODE,
} from '../keys';

import {COMMON_CODE, FILTER} from './urls';

interface IQuery {
  code: string;
  type: string;
}
// GET //
export const useDietPurposeCode = (code: IQuery) => {
  return useQuery({
    queryKey: [DIET_PURPOSE_CODE],
    queryFn: () => queryFn(`${COMMON_CODE}/${code}`),
    retry: 1,
  });
};
export const useWeightPurposeCode = (code: IQuery) => {
  return useQuery({
    queryKey: [WEIGHT_PURPOSE_CODE],
    queryFn: () => queryFn(`${COMMON_CODE}/${code}`),
    retry: 1,
  });
};
export const useAerobicPurposeCode = (code: IQuery) => {
  return useQuery({
    queryKey: [AEROBIC_PURPOSE_CODE],
    queryFn: () => queryFn(`${COMMON_CODE}/${code}`),
    retry: 1,
  });
};

export const useFilterCode = (type: IQuery) => {
  return useQuery({
    queryKey: ['filter'],
    queryFn: () => queryFn(`${FILTER}/${type}`),
  });
};

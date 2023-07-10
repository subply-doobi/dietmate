import {useQuery} from '@tanstack/react-query';
import {queryFn} from './requestFn';
import {
  DIET_PURPOSE_CODE,
  WEIGHT_PURPOSE_CODE,
  AEROBIC_PURPOSE_CODE,
  WORKOUT_PURPOSE_CODE,
  WORKOUT_INTENSITY_CODE,
  WORKOUT_FREQUENCY_CODE,
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
export const useWorkoutPurposeCode = (code: IQuery) => {
  return useQuery({
    queryKey: [WORKOUT_PURPOSE_CODE],
    queryFn: () => queryFn(`${COMMON_CODE}/${code}`),
    retry: 1,
  });
};
export const useWorkoutIntensityCode = (code: IQuery) => {
  return useQuery({
    queryKey: [WORKOUT_INTENSITY_CODE],
    queryFn: () => queryFn(`${COMMON_CODE}/${code}`),
    retry: 1,
  });
};

export const useWorkoutFrequencyCode = (code: IQuery) => {
  return useQuery({
    queryKey: [WORKOUT_FREQUENCY_CODE],
    queryFn: () => queryFn(`${COMMON_CODE}/${code}`),
    retry: 1,
  });
};
export const useWeightPurposeCode = (code: IQuery) => {
  return useQuery({
    queryKey: [WEIGHT_PURPOSE_CODE],
    queryFn: () => queryFn(`${COMMON_CODE}/${code}`),
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

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {queryFn, mutationFn} from './requestFn';
import {validateToken} from './token';
import {COMMON_CODE} from './urls';
import {
  DIET_PURPOSE_CODE,
  WEIGHT_PURPOSE_CODE,
  AEROBIC_PURPOSE_CODE,
} from '../keys';

interface IQuery {
  code: string;
}
// GET //
export const useDietPurposeCode = (code: IQuery) => {
  return useQuery({
    queryKey: [DIET_PURPOSE_CODE],
    queryFn: () => queryFn(`${COMMON_CODE}/${code}`),
    retry: 1,
    onSuccess: data => {},
  });
};
export const useWeightPurposeCode = (code: IQuery) => {
  return useQuery({
    queryKey: [WEIGHT_PURPOSE_CODE],
    queryFn: () => queryFn(`${COMMON_CODE}/${code}`),
    retry: 1,
    onSuccess: data => {},
  });
};
export const useAerobicPurposeCode = (code: IQuery) => {
  return useQuery({
    queryKey: [AEROBIC_PURPOSE_CODE],
    queryFn: () => queryFn(`${COMMON_CODE}/${code}`),
    retry: 1,
    onSuccess: data => {},
  });
};

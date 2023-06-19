import {useMutation, useQuery} from '@tanstack/react-query';

import {queryClient} from '../store';
import {IBaseLine} from '../types/baseLine';
import {BASE_LINE} from '../keys';
import {IQueryOptions} from '../types/common';
import {queryFn, mutationFn} from './requestFn';

import {CREATE_BASE_LINE, GET_BASE_LINE, UPDATE_BASE_LINE} from './urls';

// PUT
export const useCreateBaseLine = () => {
  const mutation = useMutation({
    mutationFn: (baseLine: IBaseLine) =>
      mutationFn<IBaseLine>(CREATE_BASE_LINE, 'put', baseLine),
    onSuccess: data => {
      queryClient.invalidateQueries({queryKey: [BASE_LINE]});
      console.log('생성');
    },
    onError: error => {
      console.log(error);
    },
  });
  return mutation;
};

// GET

export const useGetBaseLine = (options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  return useQuery<IBaseLine>({
    queryKey: [BASE_LINE],
    queryFn: () => queryFn(GET_BASE_LINE),
    enabled,
  });
};

// POST
export const useUpdateBaseLine = () => {
  const mutation = useMutation({
    mutationFn: (baseLine: IBaseLine) =>
      mutationFn<IBaseLine>(UPDATE_BASE_LINE, 'post', baseLine),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [BASE_LINE]});
      console.log('수정');
    },
    onError: error => {
      console.log(error);
    },
  });
  return mutation;
};

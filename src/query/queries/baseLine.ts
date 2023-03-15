import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axios from 'axios';
import {BASE_LINE} from '../keys';
import {queryClient} from '../store';
import {IBaseLine} from '../types/baseLine';
import {IQueryOptions} from '../types/common';
import {queryFn, mutationFn} from './requestFn';
import {CREATE_BASE_LINE, GET_BASE_LINE, UPDATE_BASE_LINE} from './urls';

// PUT
export const useCreateBaseLine = () => {
  const mutation = useMutation({
    mutationFn: (baseLine: IBaseLine) =>
      mutationFn<IBaseLine>(CREATE_BASE_LINE, 'put', baseLine),
    onSuccess: data => queryClient.invalidateQueries({queryKey: [BASE_LINE]}),
    onError: e => console.log('useCreateBaseLine error: ', e),
  });
  return mutation;
};

// GET

export const useGetBaseLine = (options?: IQueryOptions) => {
  // const enabled = options?.enabled ?? true;
  return useQuery<IBaseLine>({
    queryKey: [BASE_LINE],
    queryFn: () => queryFn(GET_BASE_LINE),
    retry: 0,

    // enabled,
    onSuccess: data => {},
    onError: e => {
      console.log(e);
    },
  });
};

// POST
export const useUpdateBaseLine = () => {
  const mutation = useMutation({
    mutationFn: (baseLine: IBaseLine) =>
      mutationFn<IBaseLine>(UPDATE_BASE_LINE, 'post', baseLine),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [BASE_LINE]});
    },
    onError: e => console.log('useUpdateBaseLine error: ', e),
  });
  return mutation;
};

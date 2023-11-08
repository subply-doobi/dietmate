import {useMutation, useQuery} from '@tanstack/react-query';

import {queryClient} from '../store';
import {IBaseLine, IBaseLineCreate, IBaseLineUpdate} from '../types/baseLine';
import {BASE_LINE} from '../keys';
import {IQueryOptions} from '../types/common';
import {queryFn, mutationFn} from './requestFn';

import {
  CREATE_BASE_LINE,
  GET_BASE_LINE,
  GET_GUEST,
  UPDATE_BASE_LINE,
} from './urls';

// PUT
export const useCreateBaseLine = () => {
  const mutation = useMutation({
    mutationFn: (baseLine: IBaseLineCreate) =>
      mutationFn<IBaseLineCreate>(CREATE_BASE_LINE, 'put', baseLine),
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

export const useGetGuestLogin = (options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  return useQuery<IBaseLine>({
    queryKey: [BASE_LINE],
    queryFn: () => queryFn(GET_GUEST),
    enabled,
  });
};
// POST
export const useUpdateBaseLine = () => {
  const mutation = useMutation({
    mutationFn: (baseLine: IBaseLineUpdate) =>
      mutationFn<IBaseLineUpdate>(UPDATE_BASE_LINE, 'post', baseLine),
    onSuccess: res => {
      queryClient.invalidateQueries({queryKey: [BASE_LINE]});
      console.log('수정', res);
    },
    onError: error => {
      console.log(error);
    },
  });
  return mutation;
};

import {useQuery} from '@tanstack/react-query';
import {CATEGORY} from '../keys';
import {TCategory} from '../types/category';
import {IQueryOptions} from '../types/common';
import {queryFn} from './requestFn';
import {LIST_CATEGORY, COUNT_CATEGORY} from './urls';

export const useListCategory = (options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  return useQuery<TCategory>({
    queryKey: [CATEGORY],
    queryFn: () => queryFn(LIST_CATEGORY),
    enabled,
    retry: 0,
    onSuccess: data => {},
  });
};
export const useCountCategory = (options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  return useQuery<TCategory>({
    queryKey: ['count/cateogry'],
    queryFn: () => queryFn(COUNT_CATEGORY),
    enabled,
    retry: 0,

    onSuccess: data => {},
  });
};

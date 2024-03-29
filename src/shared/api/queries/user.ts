// GET

import {IQueryOptions} from '../types/common';
import {GET_USER} from '../urls';
import {IGetUserInfo} from '../types/user';
import {USER} from '../keys';
import {queryFn} from '../requestFn';
import {useQuery} from '@tanstack/react-query';

export const useGetUser = (options?: IQueryOptions) => {
  const enabled = options?.enabled ?? true;
  return useQuery<IGetUserInfo>({
    queryKey: [USER],
    queryFn: () => queryFn(GET_USER),
    enabled,
  });
};

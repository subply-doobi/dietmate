import {useQuery} from '@tanstack/react-query';
import {queryFn} from './requestFn';

import {GET_USER} from './urls';

export const useGetProfile = () => {
  return useQuery({
    queryKey: [GET_USER],
    queryFn: () => queryFn(GET_USER),
  });
};

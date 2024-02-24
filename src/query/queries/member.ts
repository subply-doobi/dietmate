import {useQuery, useMutation} from '@tanstack/react-query';
import {queryClient} from '../store';
import {mutationFn, queryFn} from './requestFn';

import {DELETE_USER, GET_USER} from './urls';
import {IUser} from '../types/member';

export const useGetUser = () => {
  return useQuery<IUser>({
    queryKey: [GET_USER],
    queryFn: () => queryFn(GET_USER),
  });
};

export const useDeleteUser = () => {
  const mutation = useMutation({
    mutationFn: () => mutationFn(`${DELETE_USER}`, 'delete'),
    onSuccess: () => {
      queryClient.removeQueries([]);
      // queryClient.invalidateQueries([]);
    },
  });

  return mutation;
};

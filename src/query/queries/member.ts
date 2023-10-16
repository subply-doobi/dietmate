import {useQuery, useMutation} from '@tanstack/react-query';
import {queryClient} from '../store';
import {
  removeToken,
  checkNotShowAgain,
  updateNotShowAgain,
  resetGuide,
} from '../../util/asyncStorage';
import {mutationFn, queryFn} from './requestFn';

import {DELETE_USER, GET_USER} from './urls';

export const useGetProfile = () => {
  return useQuery({
    queryKey: [GET_USER],
    queryFn: () => queryFn(GET_USER),
  });
};

export const useDeleteProfile = () => {
  const mutation = useMutation({
    mutationFn: () => mutationFn(`${DELETE_USER}`, 'delete'),
    onSuccess: e => {
      console.log('delete success', e);
      removeToken();
      resetGuide();
      queryClient.removeQueries([]);
    },
    onError: e => {
      console.log('delete error', e);
    },
  });

  return mutation;
};

import {useMutation, useQuery} from '@tanstack/react-query';
import {queryClient} from '../store';

import {queryFn, mutationFn} from './requestFn';
import {useHandleError} from '../../util/handleError';

import {
  CREATE_ADDRESS,
  UPDATE_ADDRESS,
  LIST_ADDRESS,
  GET_ADDRESS,
  DELETE_ADDRESS,
} from '../queries/urls';
import {IAddressData, IAddressCreate, IAddressUpdate} from '../types/address';

//PUT
export const useCreateAddress = () => {
  const mutation = useMutation({
    mutationFn: (address: IAddressCreate) =>
      mutationFn(CREATE_ADDRESS, 'put', address),
    onSuccess: () => {
      console.log('주소생성');
      queryClient.invalidateQueries({queryKey: [LIST_ADDRESS]});
    },
  });
  return mutation;
};

//GET

//
export const useListAddress = () => {
  return useQuery<IAddressData[]>({
    queryKey: [LIST_ADDRESS],
    queryFn: () => queryFn(LIST_ADDRESS),
    onSuccess: () => {
      console.log('LIST_ADDRESS 성공');
    },
  });
};

//
export const useGetAddress = () => {
  return useQuery<IAddressData>({
    queryKey: [GET_ADDRESS],
    queryFn: () => queryFn(GET_ADDRESS),
    onSuccess: () => console.log('GET_ADDRESS 성공'),
  });
};
//POST
export const useUpdateAddress = () => {
  const mutation = useMutation({
    mutationFn: (requestBody: IAddressUpdate) =>
      mutationFn<IAddressUpdate>(UPDATE_ADDRESS, 'post', requestBody),
    onSuccess: () => {
      console.log('주소 업데이트 성공!');
      queryClient.invalidateQueries({queryKey: [LIST_ADDRESS]});
    },
  });
  return mutation;
};
//DELETE
export const useDeleteAddress = () => {
  const handleError = useHandleError();
  const mutation = useMutation({
    mutationFn: (addrNo: string) =>
      mutationFn(`${DELETE_ADDRESS}/${addrNo}`, 'delete'),
    onSuccess: () => {
      console.log('주소 삭제 성공');
      queryClient.invalidateQueries({queryKey: [LIST_ADDRESS]});
    },
    onError: error => handleError(error),
  });
  return mutation;
};

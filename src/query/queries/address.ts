import {useMutation, useQuery} from '@tanstack/react-query';
import {queryClient} from '../store';

import {queryFn, mutationFn} from './requestFn';

import {
  CREATE_ADDRESS,
  UPDATE_ADDRESS,
  LIST_ADDRESS,
  GET_ADDRESS,
  DELETE_ADDRESS,
} from '../queries/urls';

interface IAddress {
  addrNo: 'string';
  zipCode: 'string';
  addr1: 'string';
  addr2: 'string';
  companyCd: 'string';
  userId: 'string';
  useYn: 'string';
}
//PUT
export const useCreateAddress = () => {
  const mutation = useMutation({
    mutationFn: (address: IAddress) =>
      mutationFn(CREATE_ADDRESS, 'put', address),
    onSuccess: () => {
      console.log('주소생성');
      queryClient.invalidateQueries({queryKey: [LIST_ADDRESS]});
    },
  });
  return mutation;
};

//GET
export const useListAddress = () => {
  return useQuery({
    queryKey: [LIST_ADDRESS],
    queryFn: () => queryFn(LIST_ADDRESS),
    onSuccess: () => {
      console.log('LIST_ADDRESS 성공');
    },
  });
};

export const useGetAddress = () => {
  return useQuery({
    queryKey: [GET_ADDRESS],
    queryFn: () => queryFn(GET_ADDRESS),
    onSuccess: () => console.log('GET_ADDRESS 성공'),
  });
};

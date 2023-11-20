import {useMutation, useQuery} from '@tanstack/react-query';

import {
  DIET,
  ORDER,
  DIET_DETAIL,
  DIET_DETAIL_ALL,
  ORDER_DETAIL,
  PRODUCTS,
} from '../keys';
import {queryClient} from '../store';

//기존 testKakaoPay
import {mutationFn, queryFn} from './requestFn';
import {
  CREATE_ORDER,
  UPDATE_ORDER,
  LIST_ORDER,
  LIST_ORDER_DETAIL,
  DELETE_ORDER,
} from './urls';
import {IOrderCreate, IOrderData, IOrderDetailData} from '../types/order';

export const useCreateOrder = () => {
  const mutation = useMutation({
    mutationFn: (body: IOrderCreate) =>
      mutationFn(`${CREATE_ORDER}`, 'put', body),
    onSuccess: data => {
      console.log('useCreateOrder: onSuccess: ', data);
      queryClient.invalidateQueries({queryKey: [ORDER]});
      queryClient.invalidateQueries({queryKey: [DIET]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_ALL]});
    },
    onError: error => {
      console.log('useCreateOrder: onError: ', error);
    },
  });
  return mutation;
};

export const useUpdateOrder = () => {
  const mutation = useMutation({
    mutationFn: ({
      // parameter로 넘길 것
      orderNo,
      statusCd,
    }: {
      orderNo: string;
      statusCd: string;
    }) =>
      mutationFn(
        `${UPDATE_ORDER}?statusCd=${statusCd}&orderNo=${orderNo}`,
        'post',
      ),
    onSuccess: data => {
      console.log('updateOrder success: ', data);
      queryClient.invalidateQueries({queryKey: [ORDER]});
      queryClient.invalidateQueries({queryKey: [DIET]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL]});
      queryClient.invalidateQueries({queryKey: [DIET_DETAIL_ALL]});
      queryClient.invalidateQueries({queryKey: [PRODUCTS]});
    },
  });
  return mutation;
};

export const useListOrder = () => {
  return useQuery<IOrderData>({
    queryKey: [ORDER],
    queryFn: () => queryFn(`${LIST_ORDER}`),
  });
};
export const useListOrderDetail = (orderNo: string) => {
  return useQuery<IOrderDetailData>({
    queryKey: [ORDER_DETAIL],
    queryFn: () => queryFn(`${LIST_ORDER_DETAIL}/${orderNo}`),
  });
};

export const useDeleteOrder = () => {
  const mutation = useMutation({
    mutationFn: ({orderNo}: {orderNo: string}) =>
      mutationFn(`${DELETE_ORDER}/${orderNo}`, 'delete'),
    onSuccess: data => {
      console.log('deleteOrder success: ', data);
      queryClient.invalidateQueries({queryKey: [ORDER]});
    },
  });
  return mutation;
};

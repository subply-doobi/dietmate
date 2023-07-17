import axios from 'axios';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../../stores/store';
import {setOrderSummary} from '../../stores/slices/orderSlice';
import {kakaoAppAdminKey} from '../../constants/constants';
import {DIET, ORDER, DIET_DETAIL, DIET_DETAIL_ALL, ORDER_DETAIL} from '../keys';
import {queryClient} from '../store';

//기존 testKakaoPay
import {mutationFn, queryFn} from './requestFn';
import {
  CREATE_ORDER,
  UPDATE_ORDER,
  LIST_ORDER,
  LIST_ORDER_DETAIL,
  DELETE_ORDER,
  UPDATE_DIET,
} from './urls';

export const useKakaoPayReady = () => {
  const dispatch = useDispatch();
  const kakaoPayConfig = {
    headers: {
      Authorization: `KakaoAK ${kakaoAppAdminKey}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    params: {
      cid: 'TC0ONETIME',
      partner_order_id: 'partner_order_id',
      partner_user_id: 'partner_user_id',
      item_name: '테스트',
      quantity: 1,
      tax_free_amount: 0,
      approval_url: 'http://localhost:8081/',
      cancel_url: 'http://localhost:8081/',
      fail_url: 'http://localhost:8081/',
    },
  };

  const mutation = useMutation({
    mutationFn: async (price: number) => {
      const res = await axios.post(
        'https://kapi.kakao.com/v1/payment/ready',
        null,
        {
          ...kakaoPayConfig,
          params: {
            ...kakaoPayConfig.params,
            total_amount: price,
            vat_amount: 0.1 * price,
          },
        },
      );
      //TBD : ShippingFee 는 정책에 따라 결정할 것
      dispatch(
        setOrderSummary({foodPrice: price, tid: res.data.tid, shippingFee: 0}),
      );
      return res.data;
    },
  });

  return {
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    paymentUrl: mutation.isSuccess
      ? mutation.data.next_redirect_pc_url
      : undefined,
    pay: mutation.mutate,
  };
};

export const useKakaopayApprove = () => {
  const {tid, foodPrice, shippingFee, pgToken} = useSelector(
    (state: RootState) => state.order.orderSummary,
  );
  const kakaoPayConfig = {
    headers: {
      Authorization: `KakaoAK ${kakaoAppAdminKey}`,
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    params: {
      cid: 'TC0ONETIME',
      partner_order_id: 'partner_order_id',
      partner_user_id: 'partner_user_id',
      total_amount: foodPrice,
      tid: tid, //tid,pgtoken은 매번 달라진다.
      pg_token: pgToken,
    },
  };

  const mutation = useMutation(async () => {
    console.log('useMutation: kakaoConfig: ', kakaoPayConfig);
    const res = await axios.post(
      'https://kapi.kakao.com/v1/payment/approve',
      null,
      kakaoPayConfig,
    );
    //TBD : ShippingFee 는 정책에 따라 결정할 것
    return res.data;
  });

  return {
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    error: mutation.error,
    getPaymentResult: mutation.mutate,
    data: mutation.data,
  };
};

export const useCreateOrder = () => {
  const mutation = useMutation({
    mutationFn: data => mutationFn(`${CREATE_ORDER}`, 'put', data),
    // .then(res => {
    //   mutationFn(
    //     `${UPDATE_ORDER}?statusCd=SP006003&orderNo=${res.orderNo}`,
    //     'post',
    //   );
    //   mutationFn(
    //     `${UPDATE_DIET}?statusCd=SP006003&orderNo=${res.orderNo}`,
    //     'post',
    //   );
    // }
    // ),
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
    mutationFn: ({statusCd, orderNo}: {statusCd: string; orderNo: string}) =>
      mutationFn(
        `${UPDATE_ORDER}?statusCd=${statusCd}&orderNo=${orderNo}`,
        'post',
      ),
    onSuccess: data => {
      console.log('updateOrder success: ', data);
      queryClient.invalidateQueries({queryKey: [ORDER]});
    },
  });
  return mutation;
};

export const useGetOrder = () => {
  return useQuery({
    queryKey: [ORDER],
    queryFn: () => queryFn(`${LIST_ORDER}`),
  });
};
export const useGetOrderDetail = orderNo => {
  return useQuery({
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

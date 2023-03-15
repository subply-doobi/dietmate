import axios from 'axios';
import {useMutation} from '@tanstack/react-query';
import {kakaoAppAdminKey} from '../../constants/constants';
import {setOrderSummary} from '../../stores/slices/orderSlice';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../stores/store';
//기존 testKakaoPay

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

  const mutation = useMutation(
    async (price: number) => {
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
    {enabled: false},
  );

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

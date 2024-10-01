import IMP from 'iamport-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useUpdateDiet, useCreateDiet} from '../../shared/api/queries/diet';
import {useUpdateOrder, useDeleteOrder} from '../../shared/api/queries/order';
import Loading from './Loading';
import {usePreventBackBtn} from '../../screens/order/util/backEventHook';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import Config from 'react-native-config';
import {IIamportPayParams} from '../../screens/order/util/setPayData';
import {useGetPaymentStatus} from '../../shared/api/queries/payment';
import {useDispatch} from 'react-redux';
import {setPayFailAlertMsg} from '../../features/reduxSlices/orderSlice';
import {openModal} from '../../features/reduxSlices/modalSlice';

const Payment = () => {
  // navigation
  const route = useRoute();
  const {navigate, reset} = useNavigation();
  const {payParams_iamport, orderNo} = route?.params as {
    payParams_iamport: IIamportPayParams;
    orderNo: string;
  };

  // redux
  const dispatch = useDispatch();

  // react-query
  const {refetch: refetchPaymentStatus} = useGetPaymentStatus({
    enabled: false,
    merchant_uid: payParams_iamport.merchant_uid,
  });
  const updateDietMutation = useUpdateDiet();
  const updateOrderMutation = useUpdateOrder();
  const deleteOrderMutation = useDeleteOrder();

  // 안드로이드 뒤로가기버튼 방지
  usePreventBackBtn();
  // SP006004 updateOrder
  // SP006001 updateDiet
  /** 실패했을 경우
   *  1. updateDiet로 SP006001로 statusCd 변경
   *  2. deleteOrder로 SP006004로 orderNo 삭제
   *  3. navigate('Order')
   */
  const onPaymentSuccess = async () => {
    reset({
      index: 0,
      routes: [
        {name: 'BottomTabNav', params: {screen: 'NewHome'}},
        {name: 'OrderComplete'},
      ],
    });
    await updateDietMutation.mutateAsync({
      statusCd: 'SP006005',
      orderNo,
    });
    await updateOrderMutation.mutateAsync({
      orderNo,
      statusCd: 'SP006005',
    });
  };
  const onPaymentFail = async (msg: string) => {
    await updateDietMutation.mutateAsync({
      statusCd: 'SP006001',
      orderNo,
    });
    await deleteOrderMutation.mutateAsync({orderNo: orderNo});
    dispatch(openModal({name: 'payFailAlert', values: {payFailMsg: msg}}));
    navigate('Order');
  };

  return (
    <Container>
      <IMP.Payment
        userCode={Config.IAMPORT_USER_CODE} // this one you can get in the iamport console.
        data={payParams_iamport}
        callback={async response => {
          // callback response 자체가 실패한 경우
          if (response.imp_success === 'false') {
            onPaymentFail(response.error_msg);
            return;
          }

          // callback response는 성공, 실제 결제성공여부 확인
          const payRes = (await refetchPaymentStatus()).data;
          const paymentStatus = payRes?.response?.status;
          const errMsg = payRes?.response?.fail_reason;

          // 결제실패
          if (paymentStatus === 'failed') {
            onPaymentFail(errMsg);
            return;
          }

          // 결제성공
          onPaymentSuccess();
        }}
        loading={<Loading />}
      />
    </Container>
  );
};

export default Payment;

const Container = styled(SafeAreaView)`
  flex: 1;
`;

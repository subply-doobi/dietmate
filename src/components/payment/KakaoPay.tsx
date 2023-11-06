import IMP from 'iamport-react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useUpdateDiet, useCreateDiet} from '../../query/queries/diet';
import {useUpdateOrder, useDeleteOrder} from '../../query/queries/order';

const KakaoPay = () => {
  const route = useRoute();
  const {navigate, reset} = useNavigation();

  const {kakaopayData, orderNumber} = route?.params;
  const updateDietMutation = useUpdateDiet();
  const updateOrderMutation = useUpdateOrder();
  const deleteOrderMutation = useDeleteOrder();
  const createDietMutation = useCreateDiet();

  // SP006004 updateOrder
  // SP006001 updateDiet
  /** 실패했을 경우
   *  1. updateDiet로 SP006001로 statusCd 변경
   *  2. deleteOrder로 SP006004로 orderNo 삭제
   *  3. navigate('Order')
   */
  const onPaymentSuccess = async () => {
    await updateDietMutation.mutateAsync({
      statusCd: 'SP006005',
      orderNo: orderNumber.orderNo,
    });
    await updateOrderMutation.mutateAsync({
      orderNo: orderNumber.orderNo,
      statusCd: 'SP006005',
    });
    await createDietMutation.mutateAsync();
    reset({
      index: 0,
      routes: [
        {name: 'BottomTabNav', params: {screen: 'Home'}},
        {name: 'OrderComplete'},
      ],
    });
  };
  const onPaymentFail = async () => {
    await updateDietMutation.mutateAsync({
      statusCd: 'SP006001',
      orderNo: orderNumber.orderNo,
    });
    await deleteOrderMutation.mutateAsync({orderNo: orderNumber.orderNo});
    navigate('Order');
  };

  return (
    <IMP.Payment
      userCode={'imp88778331'} // this one you can get in the iamport console.
      data={kakaopayData}
      callback={response => {
        // success가 아닌 경우 1. 아임포트 자체오류 || 2. 사용자 취소 구분은 아직 없음
        response.imp_success === true ? onPaymentSuccess() : onPaymentFail();
      }}
    />
  );
};
export default KakaoPay;

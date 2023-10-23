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

  return (
    <IMP.Payment
      userCode={'imp88778331'} // this one you can get in the iamport console.
      data={kakaopayData}
      callback={response => {
        console.log('결제 응답', response);
        response.imp_success === 'true'
          ? (updateDietMutation.mutate({
              statusCd: 'SP006005',
              orderNo: orderNumber.orderNo,
            }),
            updateOrderMutation.mutate({
              orderNo: orderNumber.orderNo,
              statusCd: 'SP006005',
            }),
            reset({
              index: 0,
              routes: [
                {name: 'BottomTabNav', params: {screen: 'Home'}},
                {name: 'OrderComplete'},
              ],
            }),
            createDietMutation.mutate())
          : console.log('결제실패');

        response.error_msg === '[결제포기] 사용자가 결제를 취소하셨습니다'
          ? (navigate('Order'),
            updateDietMutation.mutate({
              statusCd: 'SP006001',
              orderNo: orderNumber.orderNo,
            }),
            deleteOrderMutation.mutate({
              orderNo: orderNumber.orderNo,
            }))
          : console.log('결제 오류');
        // SP006004 updateOrder
        // SP006001 updateDiet
        /** 실패했을 경우
         *  1. updateDiet로 SP006001로 statusCd 변경
         *  2. deleteOrder로 SP006004로 orderNo 삭제
         *  3. navigate('Order')
         */
      }}
    />
  );
};
export default KakaoPay;

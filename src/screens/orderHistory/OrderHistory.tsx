// react, RN, 3rd
import {useEffect} from 'react';
import {ActivityIndicator, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Components
import {Container} from '../../shared/ui/styledComps';
import DAlert from '../../shared/ui/DAlert';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';

// util

// react-query
import {useListOrder} from '../../shared/api/queries/order';
import {regroupByBuyDateAndDietNo} from '../../shared/utils/dataTransform';

import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../app/store/reduxStore';
import {openModal, closeModal} from '../../features/reduxSlices/modalSlice';
import OrderList from './ui/OrderList';

const OrderHistory = () => {
  // redux
  const dispatch = useDispatch();
  const orderEmptyAlert = useSelector(
    (state: RootState) => state.modal.modal.orderEmptyAlert,
  );

  // navigation
  const {data: orderData, isLoading} = useListOrder();
  const {goBack} = useNavigation();

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <Container style={{paddingLeft: 0, paddingRight: 0}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <OrderList />
      </ScrollView>

      {/* 주문내역 없을 때 알럿 */}
      <DAlert
        alertShow={orderEmptyAlert.isOpen}
        NoOfBtn={1}
        onConfirm={() => {
          dispatch(closeModal({name: 'orderEmptyAlert'}));
          goBack();
        }}
        onCancel={() => {
          dispatch(closeModal({name: 'orderEmptyAlert'}));
          goBack();
        }}
        renderContent={() => (
          <CommonAlertContent text="아직 주문내역이 없어요" />
        )}
      />
    </Container>
  );
};

export default OrderHistory;

import React, {SetStateAction, useEffect} from 'react';
import {Modal} from 'react-native';
import {useDispatch} from 'react-redux';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {Text} from 'react-native-svg';
import WebView from 'react-native-webview';

import {setOrderSummary} from '../../stores/slices/orderSlice';
import colors from '../../styles/colors';

import {useKakaopayApprove} from '../../query/queries/order';

const Cancel = styled.TouchableOpacity`
  width: 30px;
  height: 30px;
  background-color: red;
  position: absolute;
  right: 16px;
  top: 16px;
`;

interface IPaymentWebView {
  paymentUrl: string;
  isPaymentModalVisible: boolean;
  setIsPaymentModalVisible: React.Dispatch<SetStateAction<boolean>>;
}

const PaymentWebView = ({
  paymentUrl,
  isPaymentModalVisible,
  setIsPaymentModalVisible,
}: IPaymentWebView) => {
  /* Webview 컴포넌트는 testPay가 실행되면 열리고, 결제가 끝나고나면 그 페이지가 만료되기 때문에 WebView component의 onError가 발생하기 때문에
  onError일 경우 PaymentComplete 화면으로 넘어가면 된다.
  */
  const dispatch = useDispatch();

  const navigation = useNavigation();

  const {isLoading, isError, error, getPaymentResult} = useKakaopayApprove();

  useEffect(() => {
    getPaymentResult();
  }, []);

  const handleNavigationStateChange = navState => {
    const {url} = navState;
    if (url.includes('http:')) {
      console.log('changed: ', url);
    }
    const newToken = url.match(/pg_token=([\w]+)/);
    const pgToken = newToken ? newToken[1] : null;
    if (pgToken) {
      setIsPaymentModalVisible(false);
      dispatch(setOrderSummary({pgToken: pgToken}));
      getPaymentResult();
      navigation.navigate('PaymentComplete');
    }
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPaymentModalVisible ? true : false}>
        <WebView
          source={{uri: paymentUrl}}
          // onError={handleWebViewError}
          // onHttpError={handleWebViewError}
          onNavigationStateChange={handleNavigationStateChange}
        />
        <Cancel onPress={() => setIsPaymentModalVisible(false)}>
          <Text>취소</Text>
        </Cancel>
      </Modal>
    </>
  );
};

export default PaymentWebView;

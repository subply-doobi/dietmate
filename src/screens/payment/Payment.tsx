// RN
import {useRef, useState} from 'react';
import {View, ActivityIndicator, Alert, Linking, Platform} from 'react-native';

// 3rd
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import WebView, {
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';
import SendIntentAndroid from 'react-native-send-intent';

// doobi
import colors from '../../shared/colors';
import {IIamportPayParams} from '../order/util/setPayData';
import {getPaymentHtmlContent} from './util/htmlContent';
import {getPaymentResult, openOtherApp} from './util/payUtil';
import {useUpdateDiet} from '../../shared/api/queries/diet';
import {useDeleteOrder, useUpdateOrder} from '../../shared/api/queries/order';
import {closeModal, openModal} from '../../features/reduxSlices/modalSlice';
import {Container} from '../../shared/ui/styledComps';
import DAlert from '../../shared/ui/DAlert';
import {RootState} from '../../app/store/reduxStore';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';

const Payment = () => {
  // redux
  const dispatch = useDispatch();
  const payUrlAlert = useSelector(
    (state: RootState) => state.modal.modal.payUrlAlert,
  );

  // navigation
  const {goBack, reset} = useNavigation();
  const route = useRoute();
  const {payParams_iamport, orderNo} = route?.params as {
    payParams_iamport: IIamportPayParams;
    orderNo: string;
  };

  // useState
  const [loading, setLoading] = useState(true);

  // react-query
  const updateDietMutation = useUpdateDiet();
  const updateOrderMutation = useUpdateOrder();
  const deleteOrderMutation = useDeleteOrder();

  // etc
  const htmlContent = getPaymentHtmlContent(payParams_iamport);

  // handle paymentResult
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
    goBack();
  };

  // webView functions
  // const onWebViewGetMessage = (event: WebViewMessageEvent) => {
  //   const data = event.nativeEvent.data;
  //   console.log('onWebViewGetMessage: from WebView:', data);
  //   try {
  //     const response = JSON.parse(data);
  //     console.log('onWebViewGetMessage: Parsed response:', response);
  //   } catch (error) {
  //     console.error('onWebViewGetMessage: Failed to parse message:', error);
  //     console.log('onWebViewGetMessage: data:', data);
  //   }
  // };

  // const onNavigationStateChange = (navState: WebViewNavigation) => {
  //   console.log('onNavigationStateChange: ', navState);
  // };

  const onShouldStartLoadWithRequest = (navState: WebViewNavigation) => {
    const {url} = navState;
    // console.log('onShouldStartLoadWithRequest: ', navState);
    if (url === 'about:blank') return true;

    // 결제완료, 실패 로직 (외부 url -> dietmate:// 로 돌아올 때)
    if (
      url.startsWith('dietmate://payV2') ||
      url.startsWith('https://checkout-service')
    ) {
      const {txId, paymentId, code, pgCode, message, pgMessage, completeType} =
        getPaymentResult(navState.url);

      // 결제 실패, 완료시 로직 (code !== null && code !== undefined 일 때 실패)
      code != null || completeType === 'fail'
        ? onPaymentFail(message)
        : onPaymentSuccess();

      return false;
    }

    // 외부 앱 실행 로직
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      openOtherApp(url);
      return false;
    }

    return true;
  };

  return (
    <Container style={{paddingLeft: 0, paddingRight: 0}}>
      <WebView
        style={{flex: 1}}
        originWhitelist={['*']}
        source={{html: htmlContent}}
        onLoadEnd={() => setLoading(false)}
        // onMessage={onWebViewGetMessage}
        // onNavigationStateChange={onNavigationStateChange}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      />
      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
          }}>
          <ActivityIndicator size="small" color={colors.main} />
        </View>
      )}
      <DAlert
        alertShow={payUrlAlert.isOpen}
        onCancel={() => dispatch(closeModal({name: 'payUrlAlert'}))}
        onConfirm={() => dispatch(closeModal({name: 'payUrlAlert'}))}
        renderContent={() => (
          <CommonAlertContent
            text={'앱이 설치되어있는지 확인해주세요'}
            subText="문제가 계속되면 문의 바랍니다"
          />
        )}
        NoOfBtn={1}
      />
    </Container>
  );
};

export default Payment;

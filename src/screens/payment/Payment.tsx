// RN
import {useState} from 'react';
import {View, ActivityIndicator, Alert, Linking, Platform} from 'react-native';

// 3rd
import {useDispatch} from 'react-redux';
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
import {getPaymentResult} from './util/payUtil';
import {useUpdateDiet} from '../../shared/api/queries/diet';
import {useDeleteOrder, useUpdateOrder} from '../../shared/api/queries/order';
import {openModal} from '../../features/reduxSlices/modalSlice';

const Payment = () => {
  // redux
  const dispatch = useDispatch();

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
    console.log('onShouldStartLoadWithRequest: ', navState);
    const url = navState.url;

    // intent url 처리 ios
    if (url.startsWith('intent://') && Platform.OS === 'ios') {
      Linking.openURL(url).catch(err =>
        console.log('ios openURL error: ', err),
      );
      return false;
    }
    // intent url 처리 android
    if (url.startsWith('intent:') && Platform.OS === 'android') {
      SendIntentAndroid.openAppWithUri(url)
        .then(isOpened => {
          if (!isOpened)
            console.log('sendIntentAndroid openAppWithUri isOpened', isOpened);
        })
        .catch(err => {
          console.log('SendIntentAndroid.openAppWithUri error: ', err);
        });
      return false;
    }

    // 결제완료, 실패 로직 (외부 url -> dietmate:// 로 돌아올 때)
    if (
      url.startsWith('dietmate://payV2') ||
      url.startsWith('https://checkout-service')
    ) {
      const {txId, paymentId, code, pgCode, message, pgMessage} =
        getPaymentResult(navState.url);

      // 결제 실패, 완료시 로직 (code !== null && code !== undefined 일 때 실패)
      code != null ? onPaymentFail(message) : onPaymentSuccess();

      // Prevent WebView from loading the custom URL scheme
      return false;
    }

    return true;
  };

  return (
    <View style={{flex: 1}}>
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
    </View>
  );
};

export default Payment;

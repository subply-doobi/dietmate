import {Linking, Platform} from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import {openModal} from '../../../features/reduxSlices/modalSlice';
import {store} from '../../../app/store/reduxStore';

export const parseUrlParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  const queryString = url.split('?')[1];
  if (queryString) {
    const pairs = queryString.split('&');
    pairs.forEach(pair => {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
  }
  return params;
};

export const getPaymentResult = (url: string) => {
  const params = parseUrlParams(url);
  return {
    code: params.code,
    message: params.message,
    paymentId: params.paymentId,
    pgCode: params.pgCode,
    pgMessage: params.pgMessage,
    transactionType: params.transactionType,
    txId: params.txId,
    status: params.status,
    storeId: params.storeId,
    completeType: params.completeType,
  };
};

export const openDeepLink = (url: string) => {
  // 초기페이지, 결제완료(성공 or 실패)인 경우는 제외
  if (
    url === 'about:blank' ||
    url.startsWith('dietmate://payV2') ||
    url.startsWith('https://checkout-service')
  )
    return;

  // 안드로이드 intent 처리
  if (Platform.OS === 'android' && url.startsWith('intent:')) {
    SendIntentAndroid.openAppWithUri(url).catch(err => {
      console.log('SendIntentAndroid.openAppWithUri error: ', err);
      store.dispatch(openModal({name: 'payUrlAlert'}));
    });

    // ios 처리
  } else if (Platform.OS === 'ios' && !url.startsWith('intent:')) {
    Linking.openURL(url).catch(err => {
      console.log('ios openURL error: ', err);
      store.dispatch(openModal({name: 'payUrlAlert'}));
    });
  }
};

import React from 'react';
import IMP from 'iamport-react-native';
import axios from 'axios';
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

interface IIamportPayment {
  pg: string; //kakaopay, html5_inicis 등등
  pay_method: string; //결제수단: kakaopay의 경우 'card'하나만 존재
  name: string; //결제명
  amount: string; //총 결제금액
  buyer_name: string; //주문자 이름
  buyer_tel: string; //주문자 전화번호
  buyer_email: string; //주문자 이메일
  buyer_addr: string; //받는분 주소
  buyer_postcode: string; //받는분 우편번호
  merchant_uid: string; //주문번호
  custom_data: any; //custom_data: doobi자체에서 사용하는 데이터
  app_scheme: string; //앱 URL scheme
  escrow: boolean; //에스크로 사용 여부
  customer_uid: string; //고객 고유번호
}

const KakaoPay = () => {
  const route = useRoute();
  const {navigate} = useNavigation();
  const {customerData, modifiedDietTotal, priceTotal} = route.params;

  // console.log('priceTotal:', priceTotal);
  // console.log('customerData:', customerData);

  const kakaopayData: IIamportPayment = {
    pg: 'kakaopay',
    escrow: false,
    pay_method: 'card',
    name: '결제명',
    custom_data: {
      productData: modifiedDietTotal,
      customerData,
      // transactionData : response값으로
    },
    merchant_uid: `mid_${new Date().getTime()}`,
    amount: priceTotal,
    buyer_name: customerData.orderer,
    buyer_tel: customerData.ordererContact,
    buyer_email: 'example@naver.com',
    buyer_addr: customerData.address.base + customerData.address.addressDetail,
    buyer_postcode: customerData.address.postalCode,
    app_scheme: 'example',
    customer_uid: 'customer_' + new Date().getTime(),
  };

  return (
    <IMP.Payment
      userCode={'imp88778331'} // this one you can get in the iamport console.
      data={kakaopayData}
      callback={response => {
        console.log('결제 응답', response);
        // response.imp_success === 'true'
        //   ? console.log('결제성공')
        //   : navigate('Order');
        response.error_msg === '[결제포기] 사용자가 결제를 취소하셨습니다'
          ? navigate('Order')
          : console.log('결제 정상 응답');
      }}
    />
  );
};
export default KakaoPay;

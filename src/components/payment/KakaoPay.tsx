import React from 'react';
import IMP from 'iamport-react-native';
import axios from 'axios';

const KakaoPay = () => {
  //data에 구매 목록을 넣어준다.
  const data = {
    pg: 'kakaopay',
    escrow: false,
    pay_method: 'card',
    name: 'the Name',
    merchant_uid: `mid_${new Date().getTime()}`,
    amount: '39000',
    buyer_name: 'buyer name',
    buyer_tel: '01012345678',
    buyer_email: 'example@naver.com',
    buyer_addr: 'seould gangnamgu',
    buyer_postcode: '06018',
    app_scheme: 'example',
    customer_uid: 'customer_' + new Date().getTime(),
  };

  return (
    <IMP.Payment
      userCode={'imp88778331'} // this one you can get in the iamport console.
      data={data}
      callback={response => console.log(response)}
    />
  );
};
export default KakaoPay;

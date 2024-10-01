import Config from 'react-native-config';
import {IAddressData} from '../../../shared/api/types/address';
import {IDietDetailAllData} from '../../../shared/api/types/diet';
import {IUserData} from '../../../shared/api/types/user';
import {IPG, PGString} from './payConsts';

interface ICustomData {
  amount: string;
  buyerName: string;
  buyerTel: string;
  buyerAddr: string;
  buyerZipCode: string;
  entranceType: string;
  entranceNote: string;
  diet: {
    productNm: string;
    platform: string;
    price: string;
    qty: string;
    link: string;
  }[];
}

export interface IIamportPayParams {
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
  custom_data: ICustomData; //custom_data: doobi자체에서 사용하는 데이터
  app_scheme: string; //앱 URL scheme
  escrow: boolean; //에스크로 사용 여부
  customer_uid: string; //고객 고유번호
}

export interface IDoobiPayParams {
  // 두비서버 자체정보
  orderTypeCd: string;
  shippingPrice: string;
  orderPrice: string;

  // 아임포트 결제 정보 ,
  pg: string;
  escrow: string;
  payMethod: string;
  payName: string;
  payAmount: string;
  merchantUid: string;
  buyerName: string;
  buyerTel: string;
  buyerEmail: string;
  buyerAddr: string;
  buyerZipCode: string;
  appScheme: string;
  customerUid: string;
  customData: string;
}

// buyer_name, buyer_tel, buyer_email, buyer_addr, buyer_postcode
interface ISetCustomData {
  priceTotal: number;
  shippingPrice: number;
  buyerName: string;
  buyerTel: string;
  listAddressData: IAddressData[] | undefined;
  selectedAddrIdx: number;
  entranceType: string;
  entranceNote: string;
  dietDetailAllData: IDietDetailAllData;
}
export const setCustomData = ({
  priceTotal,
  shippingPrice,
  buyerName,
  buyerTel,
  listAddressData,
  selectedAddrIdx,
  entranceType,
  entranceNote,
  dietDetailAllData,
}: ISetCustomData): ICustomData => {
  return {
    amount: String(priceTotal + shippingPrice),
    buyerName: buyerName,
    buyerTel: buyerTel,
    buyerAddr: listAddressData
      ? listAddressData[selectedAddrIdx]?.addr1 +
        ' | ' +
        listAddressData[selectedAddrIdx]?.addr2
      : '',
    buyerZipCode: listAddressData
      ? listAddressData[selectedAddrIdx]?.zipCode
      : '',
    entranceType: entranceType,
    entranceNote: entranceNote,
    diet: dietDetailAllData?.map((food, idx) => {
      return {
        productNm: food.productNm,
        platform: food.platformNm,
        price: food.price,
        qty: food.qty,
        link: food.link2,
      };
    }),
  };
};

interface ISetPayParams {
  userData: IUserData;
  paymentMethod: string;
  pg: IPG;
  menuNum: number;
  productNum: number;
  priceTotal: number;
  shippingPrice: number;
  buyerName: string;
  buyerTel: string;
  listAddressData: IAddressData[] | undefined;
  selectedAddrIdx: number;
  customData: ICustomData;
}
export const setPayParams = ({
  userData,
  paymentMethod,
  pg,
  menuNum,
  productNum,
  priceTotal,
  shippingPrice,
  buyerName,
  buyerTel,
  listAddressData,
  selectedAddrIdx,
  customData,
}: ISetPayParams): {
  payParams_iamport: IIamportPayParams;
  payParams_doobi: IDoobiPayParams;
} => {
  // 주문번호 생성
  const pgString = PGString[pg];
  const merchant_uid = `mid_${userData.userId}_${new Date().getTime()}`;
  const escrow = false;
  const pay_method = paymentMethod === 'simple' ? 'card' : paymentMethod;
  const name = `${menuNum}개 끼니 (식품 ${productNum}개)`;
  const amount = String(priceTotal + shippingPrice);
  const buyer_email = userData?.email ? userData.email : '';
  const buyer_addr = listAddressData
    ? listAddressData[selectedAddrIdx]?.addr1 +
      ' | ' +
      listAddressData[selectedAddrIdx]?.addr2
    : '';
  const buyer_postcode = listAddressData
    ? listAddressData[selectedAddrIdx]?.zipCode
    : '';
  const app_scheme = 'example';
  const customer_uid = 'customer_' + new Date().getTime();
  const doobiCustomData = `${customData.entranceType} | ${customData.entranceNote} | ${shippingPrice}`;

  return {
    payParams_iamport: {
      pg: pgString,
      escrow,
      pay_method,
      name,
      merchant_uid,
      amount,
      buyer_name: buyerName,
      buyer_tel: buyerTel,
      buyer_email,
      buyer_addr,
      buyer_postcode,
      app_scheme,
      customer_uid,
      // receiver, receiverContact, entranceType, entranceNote 추가
      custom_data: customData,
    },
    payParams_doobi: {
      // 두비서버 자체정보
      orderTypeCd: 'SP011002',
      shippingPrice: String(shippingPrice),
      orderPrice: amount,

      // 아임포트 결제 정보 ,
      pg: pgString,
      escrow: String(escrow),
      payMethod: pay_method,
      payName: name,
      payAmount: amount,
      merchantUid: merchant_uid,
      buyerName: buyerName,
      buyerTel: buyerTel,
      buyerEmail: buyer_email,
      buyerAddr: buyer_addr,
      buyerZipCode: buyer_postcode,
      appScheme: app_scheme,
      customerUid: customer_uid,
      customData: doobiCustomData,
    },
  };
};

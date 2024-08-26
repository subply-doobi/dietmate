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

export interface IPayParams {
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
}: ISetPayParams): IPayParams => {
  const merchant_uid = `mid_${userData.userId}_${new Date().getTime()}`;
  return {
    pg: PGString[pg],
    escrow: false,
    pay_method: paymentMethod === 'simple' ? 'card' : paymentMethod,
    name: `${menuNum}개 끼니 (식품 ${productNum}개)`,
    merchant_uid,
    amount: String(priceTotal + shippingPrice),
    buyer_name: buyerName,
    buyer_tel: buyerTel,
    buyer_email: userData?.email ? userData.email : '',
    buyer_addr: listAddressData
      ? listAddressData[selectedAddrIdx]?.addr1 +
        ' | ' +
        listAddressData[selectedAddrIdx]?.addr2
      : '',
    buyer_postcode: listAddressData
      ? listAddressData[selectedAddrIdx]?.zipCode
      : '',
    app_scheme: 'example',
    customer_uid: 'customer_' + new Date().getTime(),
    // receiver, receiverContact, entranceType, entranceNote 추가
    custom_data: customData,
  };
};

//입력된 주문식품/주문자/배송지/받는분 정보/결제수단/결제금액으로 interface 생성
//Doobi자체에서 서버에 저장하려는 productData
export interface IPaymentProduct {
  categoryNm: string;
  categoryCd: string;
  subCategoryNm: string;
  subCategoryCd: string;
  dietNo: string;
  dietSeq: string;
  price: string;
  productNm: string;
  productNo: string;
  qty: string;
}
//useState의 customerData에 담겨있음
export interface ICustomer {
  orderer: string;
  ordererContact: string;
  email: string;
  address: {base: string; addressDetail: string; postalCode: string};
  billingInfo: string;
}
//tid, paymentMethod의 경우 현재는 kakaoPay만 사용
//ITransaction의 경우 결제 승인 후에 받아오는 response로 대체
export interface ITransaction {
  tid: string;
  date: string;
  totalPrice: string;
  paymentMethod: string;
  status: string;
}
//IDoobiPaymentData가 kakaoPay.tsx의
//kakaoPay custom_data안에 들어가는 값
export interface IDoobiPaymentData {
  productData: IPaymentProduct[];
  customerData: ICustomer;
  transactionData: ITransaction;
}
export interface IFormData {
  orderer: string;
  ordererContact: string;
  addressDetail: string;
  paymentMethod: string;
}

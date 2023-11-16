import React, {useState} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import Accordion from 'react-native-collapsible/Accordion';
import {useForm, useWatch, Controller} from 'react-hook-form';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';

import {RootState} from '../../stores/store';
import {icons} from '../../assets/icons/iconSource';
import {
  BtnBottomCTA,
  BtnText,
  Col,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../styles/StyledConsts';
import colors from '../../styles/colors';
import {SCREENWIDTH} from '../../constants/constants';
import {setOrderer, setReceiver} from '../../stores/slices/orderSlice';
import {commaToNum} from '../../util/sumUp';
import {
  ICustomer,
  IFormData,
  IDoobiPaymentData,
  IPaymentProduct,
} from './types/paymentInfo';

import FoodToOrder from '../../components/order/FoodToOrder';
import Orderer from '../../components/order/Orderer';
import Address from '../../components/order/Address';
import PaymentMethod from '../../components/order/PaymentMethod';
import PaymentWebView from '../../components/order/PaymentWebView';
import KakaoPay from '../../components/payment/KakaoPay';

import {useKakaoPayReady, useCreateOrder} from '../../query/queries/order';
import {sumUpDietTotal} from '../../util/sumUp';
import {useListAddress, useGetAddress} from '../../query/queries/address';
import {useListDietDetail} from '../../query/queries/diet';
import {useGetUser} from '../../query/queries/user';

const Order = () => {
  // redux
  const dispatch = useDispatch();
  const {orderInfo, selectedAddressId, orderSummary} = useSelector(
    (state: RootState) => state.order,
  );

  const {priceTotal, menuNum, productNum} = sumUpDietTotal(
    orderInfo.foodToOrder,
  );
  // react-query
  const {data: getAddressData} = useGetAddress();
  const {data: listAddressData, isLoading: listAddressDataLoading} =
    useListAddress();
  const {data: userData} = useGetUser();
  const createOrderMutation = useCreateOrder();

  //navigation
  const {navigate} = useNavigation();
  //cart에 있는 제품들을 주문하기 위해 paymentProduct로 변환
  //modifiedDietTotal을 서버에 저장

  let initialCustomerData: ICustomer = {
    address: {base: '', addressDetail: '', postalCode: ''},
    orderer: '', //주문자
    ordererContact: '', //주문자 연락처
    receiver: '', //받는분
    receiverContact: '', //받는분 연락처
    billingInfo: '',
    email: '',
  };
  // state
  const [customerData, setCustomerData] = useState(initialCustomerData);

  // etc
  // react-hook-form
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, isValid},
    register,
  } = useForm<IFormData>({
    defaultValues: {
      orderer: orderInfo.orderer ? orderInfo.orderer : '',
      ordererContact: orderInfo.ordererContact ? orderInfo.ordererContact : '',
      addressDetail: '',
      receiver: orderInfo.receiver ? orderInfo.receiver : '',
      receiverContact: orderInfo.receiverContact
        ? orderInfo.receiverContact
        : '',
      paymentMethod: '카카오페이',
    },
  });

  const ordererValue = useWatch({control, name: 'orderer'});
  const ordererContactValue = useWatch({control, name: 'ordererContact'});
  const addressDetailValue = useWatch({control, name: 'addressDetail'});
  const receiverValue = useWatch({control, name: 'receiver'});
  const receiverContactValue = useWatch({control, name: 'receiverContact'});
  const paymentMethodValue = useWatch({control, name: 'paymentMethod'});
  // accordion
  // activeSections[0] == 1 : 두비가 알아서 / 탄단지 비율 / 영양성분 직접 입력
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const CONTENT = [
    {
      title: '주문식품',
      subTitle: (
        <Row style={{}}>
          <HeaderSubTitle style={{flex: 1}}>
            총 끼니 {menuNum}개 ({productNum}개 식품)
          </HeaderSubTitle>
        </Row>
      ),
      content: <FoodToOrder />,
    },
    {
      title: '주문자',
      subTitle: ordererValue ? (
        <HeaderSubTitle>
          {ordererValue} | {ordererContactValue}
        </HeaderSubTitle>
      ) : (
        <HeaderSubTitle>입력해주세요</HeaderSubTitle>
      ),
      content: (
        <Orderer
          control={control}
          handleSubmit={handleSubmit}
          errors={errors}
        />
      ),
    },
    {
      title: '배송지',
      subTitle: (
        <HeaderSubTitle numberOfLines={1} ellipsizeMode={'tail'}>
          {selectedAddressId !== 0 ? (
            <HeaderSubTitle>
              {' '}
              {receiverValue} | {orderInfo.address[selectedAddressId]?.base} |{' '}
              {orderInfo.address[selectedAddressId]?.detail}
            </HeaderSubTitle>
          ) : listAddressData?.length === 0 ? (
            <HeaderSubTitle>입력해주세요</HeaderSubTitle>
          ) : listAddressDataLoading ? (
            <ActivityIndicator />
          ) : (
            <HeaderSubTitle>
              | {listAddressData[0]?.addr1} | {listAddressData[0]?.addr2}
            </HeaderSubTitle>
          )}
        </HeaderSubTitle>
      ),
      content: (
        <Address
          control={control}
          handleSubmit={handleSubmit}
          errors={errors}
          setValue={setValue}
        />
      ),
    },
    {
      title: '결제수단',
      subTitle: <HeaderSubTitle>{paymentMethodValue}</HeaderSubTitle>,
      content: <PaymentMethod control={control} setValue={setValue} />,
    },
    {
      title: '결제금액',
      subTitle:
        priceTotal > 30000 ? (
          <HeaderSubTitle>
            식품가격: {commaToNum(priceTotal)}원 | 배송비: 무료
          </HeaderSubTitle>
        ) : (
          <HeaderSubTitle>
            식품가격: {commaToNum(priceTotal)}원 | 배송비: 3,000원
          </HeaderSubTitle>
        ),
      content: <></>,
    },
  ];

  const renderHeader = (section: any, index: number, isActive: boolean) => {
    return (
      <AccordionHeader>
        <Col style={{flex: 1}}>
          <AccordionHeaderTitle>{section.title}</AccordionHeaderTitle>
          {!isActive && (
            <HeaderSubTitleBox>{section.subTitle}</HeaderSubTitleBox>
          )}
        </Col>
        {isActive ? (
          <UpDownArrow source={icons.arrowUp_20} />
        ) : (
          <UpDownArrow source={icons.arrowDown_20} />
        )}
      </AccordionHeader>
    );
  };
  const renderContent = (section: any, index: number, isActive: boolean) => {
    return section.content;
  };
  const updateSections = (actives: Array<number>) => {
    setActiveSections(actives);
    // 서버에 주문자 정보 저장 API
    dispatch(
      setOrderer({orderer: ordererValue, ordererContact: ordererContactValue}),
    );
    dispatch(
      setReceiver({
        receiver: receiverValue,
        receiverContact: receiverContactValue,
      }),
    );
    setCustomerData({
      address: {
        base: orderInfo.address[0]?.base,
        addressDetail: orderInfo.address[0]?.detail,
        postalCode: orderInfo.address[0]?.postalCode,
      },
      orderer: ordererValue,
      ordererContact: ordererContactValue,
      receiver: receiverValue,
      receiverContact: receiverContactValue,
      billingInfo: '',
      email: '',
    });
  };

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
  const kakaopayData: IIamportPayment = {
    pg: 'kakaopay',
    escrow: false,
    pay_method: 'card',
    name: `총 ${menuNum}개 끼니 (${productNum}개 식품)`,
    custom_data: {
      customerData,
      // transactionData : response값으로
    },
    merchant_uid: `mid_${new Date().getTime()}`,
    amount: String(priceTotal),
    buyer_name: customerData.orderer,
    buyer_tel: customerData.ordererContact,
    buyer_email: userData?.email ? userData.email : '',
    buyer_addr: customerData.address.base + customerData.address.addressDetail,
    buyer_postcode: customerData.address.postalCode,
    app_scheme: 'example',
    customer_uid: 'customer_' + new Date().getTime(),
  };

  const onHandleOrder = async () => {
    if (
      !(
        isValid &&
        listAddressData?.length !== 0 &&
        getAddressData?.length !== 0
      )
    ) {
      return;
    }
    const orderNumber = await createOrderMutation.mutateAsync({
      // 두비서버 자체정보
      orderTypeCd: 'SP011002',
      shippingPrice: '4000',
      orderPrice: kakaopayData.amount,

      // 아임포트 결제 정보 ,
      pg: kakaopayData.pg,
      escrow: String(kakaopayData.escrow),
      payMethod: '카카오페이',
      payName: kakaopayData.name,
      payAmount: kakaopayData.amount,
      merchantUid: kakaopayData.merchant_uid,
      buyerName: kakaopayData.buyer_name,
      buyerTel: kakaopayData.buyer_tel,
      buyerEmail: kakaopayData.buyer_email,
      buyerAddr: kakaopayData.buyer_addr,
      buyerZipCode: kakaopayData.buyer_postcode,
      appScheme: kakaopayData.app_scheme,
      customerUid: kakaopayData.customer_uid,
    });
    navigate('KakaoPayNav', {
      kakaopayData,
      orderNumber,
    });
  };

  return listAddressDataLoading ? (
    <ActivityIndicator />
  ) : (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 80}}>
        <Accordion
          containerStyle={{marginTop: 16}}
          activeSections={activeSections}
          sections={CONTENT}
          touchableComponent={TouchableOpacity}
          renderHeader={renderHeader}
          renderContent={renderContent}
          duration={200}
          onChange={updateSections}
          renderFooter={() => <HorizontalSpace height={16} />}
        />
      </ScrollView>
      <BtnBottomCTA
        style={{width: SCREENWIDTH - 32}}
        btnStyle={
          isValid &&
          listAddressData?.length !== 0 &&
          getAddressData?.length !== 0
            ? 'activated'
            : 'inactivated'
        }
        onPress={async () => onHandleOrder()}>
        <BtnText>
          {isValid &&
          listAddressData?.length !== 0 &&
          getAddressData?.length !== 0
            ? `총 ${commaToNum(priceTotal)}원 결제하기`
            : '정보를 모두 입력해주세요'}
        </BtnText>
      </BtnBottomCTA>
      {/* <PaymentWebView
        paymentUrl={paymentUrl}
        isPaymentModalVisible={isPaymentModalVisible}
        setIsPaymentModalVisible={setIsPaymentModalVisible}
      /> */}
    </SafeAreaView>
  );
};

export default Order;

const AccordionHeader = styled.View`
  flex-direction: row;
  width: 100%;
  height: 64px;
  padding: 0px 16px 0px 16px;
  background-color: ${colors.white};
  align-items: center;
  justify-content: space-between;
`;

const AccordionHeaderTitle = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
`;

const HeaderSubTitleBox = styled.View``;

const HeaderSubTitle = styled(TextSub)`
  font-size: 14px;
  margin-top: 4px;
`;
const UpDownArrow = styled.Image`
  width: 20px;
  height: 20px;
  margin-left: 8px;
`;

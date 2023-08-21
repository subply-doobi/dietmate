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

const Order = () => {
  // const {data: listAddressData} = useListAddress();
  // console.log('listAddressData:', listAddressData);
  const {data: getAddressData} = useGetAddress();
  const {data: listAddressData, isLoading: listAddressDataLoading} =
    useListAddress();
  console.log('listAddressData:', listAddressData);
  // console.log('getAddressData:', getAddressData);
  //navigation
  const {navigate} = useNavigation();
  //cart에 있는 제품들을 주문하기 위해 paymentProduct로 변환
  //modifiedDietTotal을 서버에 저장

  // redux
  const {orderInfo, selectedAddressId, orderSummary} = useSelector(
    (state: RootState) => state.order,
  );
  console.log(selectedAddressId);
  const {foodToOrder} = orderInfo;
  const {priceTotal, menuNum, productNum} = sumUpDietTotal(
    orderInfo.foodToOrder,
  );
  const createOrderMutation = useCreateOrder();

  // 주문자 정보가 orderInfo에 저장되어있음

  const dispatch = useDispatch();

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
  let totalAmount = 2200;
  //totalAmount는 잠시 이렇게
  // let totalAmount: number = cart[0].reduce((acc: number, cur: IProduct) => {
  //   acc = acc + cur.price * cur.qty;
  //   return acc;
  // }, 0);

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
      subTitle: (
        <HeaderSubTitle>
          {ordererValue} | {ordererContactValue}
        </HeaderSubTitle>
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

  const handlePressPaymentBtn = () => {
    pay(2400);
    setIsPaymentModalVisible(true);
  };
  // AddressEdit스크린에서 다시 Orders스크린 온 경우 active section설정
  // navigation 적용할 것 -> InputNav.tsx: AddressEdit Screen | AddressEdit.tsx: delete, confirm
  // useEffect(() => {
  //   handleSubmit(() => {})();
  // }, []);

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
        btnStyle={isValid ? 'activated' : 'inactivated'}
        onPress={async () => {
          if (!isValid) {
            return;
          }
          const orderNumber = await createOrderMutation.mutateAsync({});
          navigate('KakaoPayNav', {
            priceTotal,
            customerData,
            orderNumber,
          });
        }}>
        <BtnText>
          {isValid
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

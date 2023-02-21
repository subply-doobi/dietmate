import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {
  BtnBottomCTA,
  BtnText,
  Col,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../styles/styledConsts';
import Accordion from 'react-native-collapsible/Accordion';
import {useForm, useWatch} from 'react-hook-form';
import colors from '../../styles/colors';
import {useSelector} from 'react-redux';
import {RootState} from '../../stores/store';
import FoodToOrder from '../../components/order/FoodToOrder';
import Orderer from '../../components/order/Orderer';
import Address from '../../components/order/Address';
import PaymentMethod from '../../components/order/PaymentMethod';
import {
  IProduct,
  kakaoAppAdminKey,
  NavigationProps,
  SCREENWIDTH,
} from '../../constants/constants';
import axios from 'axios';
import PaymentWebView from '../../components/order/PaymentWebView';

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundLight};
`;

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

const Order = ({navigation: {navigate}, route}: NavigationProps) => {
  // cart information -> 장바구니에서 route에 담아 보내줄 것.
  // 근데 그냥 장바구니식품 불러와서, 수량은 장바구니 qty쓰면 되는 거 아닌가...?!
  // TBD | 장바구니 담긴 식품 판매자별로 정리 및 식품가격 배송비 각각 변수에

  // redux

  const {cart} = useSelector((state: RootState) => state.cart);
  const {orderInfo, selectedAddressId} = useSelector(
    (state: RootState) => state.order,
  );
  console.log('cart:', cart);

  let totalAmount: number = cart[0].reduce((acc: number, cur: IProduct) => {
    acc = acc + cur.price * cur.qty;
    return acc;
  }, 0);

  // react-hook-form
  interface IFormData {
    orderer: string;
    ordererContact: string;
    addressDetail: string;
    receiver: string;
    receiverContact: string;
    paymentMethod: string;
  }
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors, isValid},
  } = useForm<IFormData>({
    defaultValues: {
      orderer: orderInfo.orderer ? orderInfo.orderer : '',
      ordererContact: orderInfo.ordererContact ? orderInfo.ordererContact : '',
      addressDetail: '',
      receiver: orderInfo.receiver ? orderInfo.receiver : '',
      receiverContact: orderInfo.receiverContact
        ? orderInfo.receiverContact
        : '',
      paymentMethod: 'kakao',
    },
  });

  const ordererValue = useWatch({control, name: 'orderer'});
  const ordererContactValue = useWatch({control, name: 'ordererContact'});
  const addressDetailValue = useWatch({control, name: 'addressDetail'});
  const receiverValue = useWatch({control, name: 'receiver'});
  const receiverContactValue = useWatch({control, name: 'receiverContact'});
  const paymentMethodValue = useWatch({control, name: 'paymentMethod'});
  console.log('Order: route:', route);
  // accordion
  // activeSections[0] == 1 : 두비가 알아서 / 탄단지 비율 / 영양성분 직접 입력
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const CONTENT = [
    {
      title: '주문식품',
      subTitle: (
        <Row style={{}}>
          <HeaderSubTitle style={{flex: 1}}>테스트테스트</HeaderSubTitle>
          <HeaderSubTitle>외</HeaderSubTitle>
        </Row>
      ),
      content: <FoodToOrder cartInfo={cart} />,
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
          {receiverValue} | {orderInfo.address[selectedAddressId]?.base} |{' '}
          {orderInfo.address[selectedAddressId]?.detail}
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
      subTitle: <HeaderSubTitle>{totalAmount}원</HeaderSubTitle>,
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
          <UpDownArrow source={require('../../assets/icons/20_up.png')} />
        ) : (
          <UpDownArrow source={require('../../assets/icons/20_down.png')} />
        )}
      </AccordionHeader>
    );
  };
  const renderContent = (section: any, index: number, isActive: boolean) => {
    return section.content;
  };
  const updateSections = (actives: Array<number>) => {
    setActiveSections(actives);
  };
  const [paymentUrl, setPaymentUrl] = useState('');
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const testKakaoPay = async () => {
    const kakaoPayConfig = {
      headers: {
        Authorization: `KakaoAK ${kakaoAppAdminKey}`,
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      params: {
        cid: 'TC0ONETIME',
        partner_order_id: 'partner_order_id',
        partner_user_id: 'partner_user_id',
        item_name: '테스트',
        quantity: 1,
        total_amount: 2200,
        vat_amount: 200,
        tax_free_amount: 0,
        approval_url: 'http://localhost:8081/',
        cancel_url: 'http://localhost:8081/',
        fail_url: 'http://localhost:8081/',
      },
    };
    try {
      const res = await axios.post(
        'https://kapi.kakao.com/v1/payment/ready',
        null,
        kakaoPayConfig,
      );

      setPaymentUrl(res.data.next_redirect_mobile_url);
      setIsPaymentModalVisible(true);
      console.log('tid:', res.data.tid);
    } catch (e) {
      console.log(e);
    }
  };
  // AddressEdit스크린에서 다시 Orders스크린 온 경우 active section설정
  // navigation 적용할 것 -> InputNav.tsx: AddressEdit Screen | AddressEdit.tsx: delete, confirm
  // useEffect(() => {
  //   handleSubmit(() => {})();
  // }, []);

  return (
    <Container>
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
          Object.keys(errors).length === 0 &&
          orderInfo.address[selectedAddressId]
            ? 'activated'
            : 'inactivated'
        }
        onPress={testKakaoPay}>
        <BtnText>
          {Object.keys(errors).length === 0 &&
          orderInfo.address[selectedAddressId]
            ? `총 ${totalAmount}원 결제하기`
            : '정보를 모두 입력해주세요'}
        </BtnText>
      </BtnBottomCTA>
      <PaymentWebView
        uri={paymentUrl}
        isPaymentModalVisible={isPaymentModalVisible}
        setIsPaymentModalVisible={setIsPaymentModalVisible}
      />
    </Container>
  );
};

export default Order;

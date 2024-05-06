import {useState} from 'react';
import {
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import styled from 'styled-components/native';
import Accordion from 'react-native-collapsible/Accordion';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {RootState} from '../../app/store/reduxStore';
import {icons} from '../../shared/iconSource';
import {
  AccordionContentContainer,
  BtnBottomCTA,
  BtnText,
  Col,
  Container,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../shared/ui/styledComps';
import colors from '../../shared/colors';
import {KAKAOPAY_CID, SCREENWIDTH} from '../../shared/constants';
import {commaToNum} from '../../shared/utils/sumUp';

import FoodToOrder from './ui/FoodToOrder';
import Orderer from './ui/Orderer';
import Address from './ui/Address';
import PaymentMethod from './ui/PaymentMethod';
import BusinessInfo from '../../components/common/businessInfo/BusinessInfo';

import {useCreateOrder} from '../../shared/api/queries/order';
import {sumUpDietTotal} from '../../shared/utils/sumUp';
import {useListAddress} from '../../shared/api/queries/address';
import {useGetUser} from '../../shared/api/queries/user';
import {useListDietDetailAll} from '../../shared/api/queries/diet';
import CtaButton from '../../shared/ui/CtaButton';

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

const Order = () => {
  //navigation
  const {navigate} = useNavigation();

  // redux
  const {foodToOrder, selectedAddrIdx, shippingPrice} = useSelector(
    (state: RootState) => state.order,
  );
  const {buyerName, buyerTel, entranceType, entranceNote, paymentMethod} =
    useSelector((state: RootState) => state.userInput);

  // react-query
  const {data: listAddressData, isLoading: listAddressDataLoading} =
    useListAddress();
  const {data: userData} = useGetUser();
  const {data: dietDetailAllData} = useListDietDetailAll();
  const createOrderMutation = useCreateOrder();

  // etc
  const {priceTotal, menuNum, productNum} = sumUpDietTotal(foodToOrder);

  // validation
  const invalidateInput = [buyerName, buyerTel, paymentMethod].find(
    v => !v.isValid,
  );
  const validationErrMsg = !listAddressData
    ? '잠시만 기다려주세요'
    : invalidateInput
      ? invalidateInput.errMsg
      : listAddressData.length === 0
        ? '주소를 입력해주세요'
        : listAddressData[selectedAddrIdx]?.addr1 === ''
          ? '주소를 입력해주세요'
          : listAddressData[selectedAddrIdx]?.addr2 === ''
            ? '상세주소를 입력해주세요'
            : ``;
  const ctaBtnStyle = validationErrMsg === '' ? 'active' : 'inactive';
  const ctaBtnText =
    validationErrMsg === ''
      ? `총 ${commaToNum(priceTotal + shippingPrice)}원 결제하기`
      : validationErrMsg;

  // accordion
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const CONTENT = [
    {
      title: '주문식품',
      subTitle: (
        <Row>
          <HeaderSubTitle style={{flex: 1}}>
            총 끼니 {menuNum}개 ({productNum}개 식품)
          </HeaderSubTitle>
        </Row>
      ),
      content: <FoodToOrder />,
    },
    {
      title: '주문자',
      subTitle: buyerName ? (
        <HeaderSubTitle>
          {buyerName.value} | {buyerTel.value}
        </HeaderSubTitle>
      ) : (
        <HeaderSubTitle>입력해주세요</HeaderSubTitle>
      ),
      content: <Orderer />,
    },
    {
      title: '배송지',
      subTitle: (
        <HeaderSubTitle numberOfLines={1} ellipsizeMode={'tail'}>
          <HeaderSubTitle>
            {listAddressData && listAddressData[selectedAddrIdx]?.addr1} |{' '}
            {listAddressData && listAddressData[selectedAddrIdx]?.addr2}
          </HeaderSubTitle>
        </HeaderSubTitle>
      ),
      content: <Address />,
    },
    {
      title: '결제수단',
      subTitle: <HeaderSubTitle>{paymentMethod.value}</HeaderSubTitle>,
      content: <PaymentMethod />,
    },
    {
      title: '결제금액',
      subTitle: (
        <HeaderSubTitle>
          식품가격: {commaToNum(priceTotal)}원 | 배송비:{' '}
          {commaToNum(shippingPrice)}원
        </HeaderSubTitle>
      ),
      content: (
        <AccordionContentContainer>
          <HeaderSubTitle>
            식품가격: {commaToNum(priceTotal)}원 | 배송비:{' '}
            {commaToNum(shippingPrice)}원
          </HeaderSubTitle>
        </AccordionContentContainer>
      ),
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
  };

  // order Btn action
  const onHandleOrder = async () => {
    if (validationErrMsg !== '') return;

    // buyer_name, buyer_tel, buyer_email, buyer_addr, buyer_postcode
    const customData = {
      amount: String(priceTotal + shippingPrice),
      buyerName: buyerName.value,
      buyerTel: buyerTel.value,
      buyerAddr: listAddressData
        ? listAddressData[selectedAddrIdx]?.addr1 +
          ' | ' +
          listAddressData[selectedAddrIdx]?.addr2
        : '',
      buyerZipCode: listAddressData
        ? listAddressData[selectedAddrIdx]?.zipCode
        : '',
      entranceType: entranceType.value,
      entranceNote: entranceNote.value,
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

    // payment data
    const kakaopayData: IIamportPayment = {
      pg: `kakaopay.${KAKAOPAY_CID}`,
      escrow: false,
      pay_method: 'card',
      name: `총 ${menuNum}개 끼니 (${productNum}개 식품)`,
      merchant_uid: `mid_${new Date().getTime()}`,
      amount: String(priceTotal + shippingPrice),
      buyer_name: buyerName.value,
      buyer_tel: buyerTel.value,
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

    const orderNumber = await createOrderMutation.mutateAsync({
      // 두비서버 자체정보
      orderTypeCd: 'SP011002',
      shippingPrice: String(shippingPrice),
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
      // receiver, receiverContact, entranceType, entranceNote 추가
      // customData: 'customData',
      customData: entranceType.value + entranceNote.value + shippingPrice,
    });

    navigate('KakaoPay', {
      kakaopayData,
      orderNumber,
    });
  };

  return listAddressDataLoading ? (
    <Container>
      <ActivityIndicator />
    </Container>
  ) : (
    <Container
      style={{
        paddingRight: 0,
        paddingLeft: 0,
        backgroundColor: colors.backgroundLight2,
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
        <BusinessInfo />
      </ScrollView>

      {/* 결제버튼 */}
      <CtaButton
        btnStyle={ctaBtnStyle}
        style={{width: SCREENWIDTH - 32}}
        onPress={async () => onHandleOrder()}
        btnText={ctaBtnText}
      />
    </Container>
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

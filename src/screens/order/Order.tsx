import {useMemo, useState} from 'react';
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
  Col,
  Container,
  HorizontalSpace,
  Row,
  TextMain,
  TextSub,
} from '../../shared/ui/styledComps';
import colors from '../../shared/colors';
import {SCREENWIDTH} from '../../shared/constants';
import {commaToNum, sumUpDietFromDTOData} from '../../shared/utils/sumUp';

import FoodToOrder from './ui/FoodToOrder';
import Orderer from './ui/Orderer';
import Address from './ui/Address';
import PaymentMethod from './ui/PaymentMethod';
import BusinessInfo from '../../components/common/businessInfo/BusinessInfo';

import {useCreateOrder} from '../../shared/api/queries/order';
import {useListAddress} from '../../shared/api/queries/address';
import {useGetUser} from '../../shared/api/queries/user';
import CtaButton from '../../shared/ui/CtaButton';
import {tfDTOToDDA} from '../../shared/utils/dataTransform';
import {setCustomData, setPayParams} from './util/setPayData';

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
  const createOrderMutation = useCreateOrder();

  // useMemo
  const {priceTotal, menuNum, productNum, dietDetailAllData} = useMemo(() => {
    const {priceTotal, menuNum, productNum} = sumUpDietFromDTOData(foodToOrder);
    const dietDetailAllData = tfDTOToDDA(foodToOrder);
    return {priceTotal, menuNum, productNum, dietDetailAllData};
  }, [foodToOrder]);

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
      subTitle: buyerName.value ? (
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
      subTitle:
        listAddressData?.length !== 0 ? (
          <HeaderSubTitle numberOfLines={1} ellipsizeMode={'tail'}>
            <HeaderSubTitle>
              {listAddressData && listAddressData[selectedAddrIdx]?.addr1} |{' '}
              {listAddressData && listAddressData[selectedAddrIdx]?.addr2}
            </HeaderSubTitle>
          </HeaderSubTitle>
        ) : (
          <HeaderSubTitle>입력해주세요</HeaderSubTitle>
        ),
      content: <Address />,
    },
    {
      title: '결제수단',
      subTitle: (
        <HeaderSubTitle>
          {{kakao: '카카오페이', smartro: '일반결제'}[paymentMethod.value] ||
            ''}
        </HeaderSubTitle>
      ),
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
    if (!listAddressData || !userData) return;
    if (validationErrMsg !== '') return;

    const customData = setCustomData({
      priceTotal,
      shippingPrice,
      buyerName: buyerName.value,
      buyerTel: buyerTel.value,
      listAddressData,
      selectedAddrIdx,
      entranceType: entranceType.value,
      entranceNote: entranceNote.value,
      dietDetailAllData,
    });

    // Iamport payment params
    const payParams = setPayParams({
      userData,
      paymentMethod: paymentMethod.value,
      menuNum,
      productNum,
      priceTotal,
      shippingPrice,
      buyerName: buyerName.value,
      buyerTel: buyerTel.value,
      listAddressData,
      selectedAddrIdx,
      customData,
    });

    const orderNo = (
      await createOrderMutation.mutateAsync({
        // 두비서버 자체정보
        orderTypeCd: 'SP011002',
        shippingPrice: String(shippingPrice),
        orderPrice: payParams.amount,

        // 아임포트 결제 정보 ,
        pg: payParams.pg,
        escrow: String(payParams.escrow),
        payMethod: paymentMethod.value,
        payName: payParams.name,
        payAmount: payParams.amount,
        merchantUid: payParams.merchant_uid,
        buyerName: payParams.buyer_name,
        buyerTel: payParams.buyer_tel,
        buyerEmail: payParams.buyer_email,
        buyerAddr: payParams.buyer_addr,
        buyerZipCode: payParams.buyer_postcode,
        appScheme: payParams.app_scheme,
        customerUid: payParams.customer_uid,
        // receiver, receiverContact, entranceType, entranceNote 추가
        // customData: 'customData',
        customData: entranceType.value + entranceNote.value + shippingPrice,
      })
    ).orderNo;

    navigate('Payment', {
      payParams,
      orderNo,
    });
  };

  return listAddressDataLoading ? (
    <Container style={{justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="small" color={colors.main} />
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
        style={{width: SCREENWIDTH - 32, position: 'absolute', bottom: 8}}
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
  line-height: 22px;
  font-weight: bold;
`;

const HeaderSubTitleBox = styled.View``;

const HeaderSubTitle = styled(TextSub)`
  font-size: 14px;
  line-height: 18px;
  margin-top: 4px;
`;
const UpDownArrow = styled.Image`
  width: 20px;
  height: 20px;
  margin-left: 8px;
`;

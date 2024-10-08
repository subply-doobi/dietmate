import {useMemo, useState} from 'react';
import {TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import {RootState} from '../../app/store/reduxStore';
import {Container, HorizontalSpace} from '../../shared/ui/styledComps';
import colors from '../../shared/colors';
import {SCREENWIDTH} from '../../shared/constants';
import {commaToNum, sumUpDietFromDTOData} from '../../shared/utils/sumUp';
import BusinessInfo from '../../components/common/businessInfo/BusinessInfo';

import {useCreateOrder} from '../../shared/api/queries/order';
import {useListAddress} from '../../shared/api/queries/address';
import {useGetUser} from '../../shared/api/queries/user';
import CtaButton from '../../shared/ui/CtaButton';
import {tfDTOToDDA} from '../../shared/utils/dataTransform';
import {setCustomData, setPayParams} from './util/setPayData';
import DAlert from '../../shared/ui/DAlert';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';
import {PAY_METHOD} from './util/payConsts';
import {closeModal} from '../../features/reduxSlices/modalSlice';
import {getOrderAccordionContent} from './util/orderAccordion';

const Order = () => {
  //navigation
  const {navigate} = useNavigation();

  // redux
  const dispatch = useDispatch();
  const {foodToOrder, selectedAddrIdx, shippingPrice} = useSelector(
    (state: RootState) => state.order,
  );
  const {buyerName, buyerTel, entranceType, entranceNote, paymentMethod, pg} =
    useSelector((state: RootState) => state.userInput);
  const payFailAlert = useSelector(
    (state: RootState) => state.modal.modal.payFailAlert,
  );

  // useState
  const [activeSections, setActiveSections] = useState<number[]>([]);

  // react-query
  const {data: listAddressData, isLoading: listAddressDataLoading} =
    useListAddress();
  const {data: userData} = useGetUser();
  const createOrderMutation = useCreateOrder();

  // useMemo
  const {priceTotal, menuNum, productNum, dietDetailAllData, accordionContent} =
    useMemo(() => {
      const {priceTotal, menuNum, productNum} =
        sumUpDietFromDTOData(foodToOrder);
      const dietDetailAllData = tfDTOToDDA(foodToOrder);

      const currentPayMethodItem = PAY_METHOD.find(
        item => item.value === paymentMethod.value,
      );
      const accordionContent = getOrderAccordionContent({
        menuNum,
        productNum,
        buyerName,
        buyerTel,
        listAddressData,
        selectedAddrIdx,
        currentPayMethodItem,
        pg,
        priceTotal,
        shippingPrice,
      });

      return {
        priceTotal,
        menuNum,
        productNum,
        dietDetailAllData,
        accordionContent,
      };
    }, [foodToOrder, listAddressData, activeSections]);

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
    const {payParams_doobi, payParams_iamport} = setPayParams({
      userData,
      paymentMethod: paymentMethod.value,
      pg: pg.value,
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

    const orderNo = (await createOrderMutation.mutateAsync(payParams_doobi))
      .orderNo;

    navigate('Payment', {
      payParams_iamport,
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
          sections={accordionContent}
          touchableComponent={TouchableOpacity}
          renderHeader={(content, index, isActive) =>
            isActive ? content.activeHeader : content.inActiveHeader
          }
          renderContent={(content, index, isActive) => content.content}
          duration={200}
          onChange={activeSections => setActiveSections(activeSections)}
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

      {/* 결제실패알럿 */}
      <DAlert
        alertShow={payFailAlert.isOpen}
        NoOfBtn={1}
        onCancel={() => dispatch(closeModal({name: 'payFailAlert'}))}
        onConfirm={() => dispatch(closeModal({name: 'payFailAlert'}))}
        renderContent={() => (
          <CommonAlertContent
            text="결제실패"
            subText={payFailAlert.values?.payFailMsg}
          />
        )}
      />
    </Container>
  );
};

export default Order;

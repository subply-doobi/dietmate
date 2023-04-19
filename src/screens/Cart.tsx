// react, RN, 3rd
import {useEffect, useMemo, useState} from 'react';
import {ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';

// doobi util, redux, etc
import colors from '../styles/colors';
import {commaToNum, reGroupBySeller, sumUpPrice} from '../util/sumUp';
import {setCurrentDiet, setMenuActiveSection} from '../stores/slices/cartSlice';
import {SCREENWIDTH} from '../constants/constants';
import {icons} from '../assets/icons/iconSource';
import {getDietAddStatus} from '../util/getDietAddStatus';
import {RootState} from '../stores/store';

// doobi Component
import {BtnBottomCTA, BtnText, Row, TextSub} from '../styles/StyledConsts';
import CartSummary from '../components/cart/CartSummary';
import DAlert from '../components/common/alert/DAlert';
import CreateLimitAlertContent from '../components/common/alert/CreateLimitAlertContent';
import CommonAlertContent from '../components/common/alert/CommonAlertContent';
import NumberPickerContent from '../components/cart/NumberPickerContent';
import DBottomSheet from '../components/common/DBottomSheet';
import AccordionContent from '../components/cart/AccordionContent';
import AccordionInactiveHeader from '../components/cart/AccordionInactiveHeader';
import AccordionActiveHeader from '../components/cart/AccordionActiveHeader';

// react-query
import {IDietDetailData} from '../query/types/diet';
import {
  useCreateDiet,
  useGetDietDetailEmptyYn,
  useListDiet,
  useListDietDetailAll,
  useListDietTotal,
} from '../query/queries/diet';

const Cart = () => {
  // redux
  const dispatch = useDispatch();
  const {menuActiveSection} = useSelector((state: RootState) => state.cart);

  // react-query
  const {data: dietData} = useListDiet();
  const {data: dietDetailAllData} = useListDietDetailAll();
  const {data: dietEmptyData} = useGetDietDetailEmptyYn();
  const dietTotalData =
    !!dietData && useListDietTotal(dietData, {enabled: !!dietData});
  const createDietMutation = useCreateDiet();

  // state
  const [createAlertShow, setCreateAlertShow] = useState(false);
  const [numberPickerShow, setNumberPickerShow] = useState(false);
  const [detailDataToNoControl, setdetailDataToNoControl] =
    useState<IDietDetailData>([]);

  const totalStatus =
    dietTotalData &&
    dietTotalData.map(menu => menu.isInitialLoading).includes(true)
      ? 'isInitialLoading'
      : 'isInitialLoaded';

  // etc
  // navigation
  const navigation = useNavigation();

  // accordion
  const ACCORDION_CONTENT =
    dietData && dietTotalData && totalStatus === 'isInitialLoaded'
      ? dietTotalData.map((menu, idx) => {
          return {
            inactiveHeader: (
              <AccordionInactiveHeader
                idx={idx}
                dietNo={dietData[idx].dietNo}
                dietSeq={dietData[idx].dietSeq}
                dietDetailData={menu.data ?? []}
                // setActiveSections={setActiveSections}
                setNumberPickerShow={setNumberPickerShow}
              />
            ),
            content: (
              <AccordionContent
                dietNo={dietData[idx].dietNo}
                dietDetailData={menu.data ?? []}
                setNumberPickerShow={setNumberPickerShow}
              />
            ),
            activeHeader: (
              <AccordionActiveHeader
                idx={idx}
                dietNo={dietData[idx].dietNo}
                dietSeq={dietData[idx].dietSeq}
                dietDetailData={menu.data ?? []}
              />
            ),
          };
        })
      : [
          {
            inactiveHeader: <></>,
            activeHeader: <></>,
            content: <></>,
          },
        ];

  const updateSections = (activeSections: number[]) => {
    dispatch(setMenuActiveSection(activeSections));
    if (activeSections.length === 0) return;
    const currentIdx = activeSections[0];
    const currentDietNo = dietData && dietData[currentIdx].dietNo;
    currentDietNo && dispatch(setCurrentDiet(currentDietNo));
  };

  // 추가된 식품 하나도 없으면 주문버튼 비활성
  const isEmpty = dietDetailAllData ? dietDetailAllData.length === 0 : false;
  const totalPrice = useMemo(() => {
    if (isEmpty) return 0;
    const reGroupedProducts =
      dietDetailAllData && reGroupBySeller(dietDetailAllData);
    if (!reGroupedProducts) return 0;
    let totalProductPrice = 0;
    let totalShippingPrice = 0;

    for (let i = 0; i < reGroupedProducts.length; i++) {
      const sellerProductPrice = sumUpPrice(reGroupedProducts[i]);
      const sellershippingPrice =
        sellerProductPrice < parseInt(reGroupedProducts[i][0].freeShippingPrice)
          ? parseInt(reGroupedProducts[i][0].shippingPrice)
          : 0;
      totalProductPrice += sellerProductPrice;
      // totalShippingPrice += sellershippingPrice; // 일단 배송비는 장바구니에서만 보이게 할 것
    }
    // const totalPrice = totalProductPrice + totalShippingPrice;

    const totalPrice = totalProductPrice;
    return totalPrice;
  }, [dietDetailAllData]);

  const addAlertStatus = getDietAddStatus(dietData, dietEmptyData);
  const onCreateDiet = () => {
    if (addAlertStatus === 'possible') {
      createDietMutation.mutate();
      return;
    }
    setCreateAlertShow(true);
  };

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentContainer>
          {totalStatus === 'isInitialLoading' ? (
            <ActivityIndicator style={{marginTop: 16}} />
          ) : (
            <>
              {/* 장바구니 각 끼니들 accordion */}
              <Accordion
                activeSections={menuActiveSection}
                sections={ACCORDION_CONTENT}
                touchableComponent={TouchableOpacity}
                renderHeader={(section, _, isActive) =>
                  isActive ? section.activeHeader : section.inactiveHeader
                }
                renderContent={section => section.content}
                onChange={updateSections}
              />

              {/* 끼니 추가 버튼 */}
              <CreateDietBtn
                onPress={onCreateDiet}
                disabled={!dietEmptyData || dietEmptyData.emptyYn === 'Y'}>
                <LeftBar />
                {createDietMutation.isLoading ? (
                  <ActivityIndicator />
                ) : (
                  <Row
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      marginLeft: -16,
                    }}>
                    <PlusImage source={icons.plusSquare_24} />
                    <CreateDietText>끼니 추가하기</CreateDietText>
                  </Row>
                )}
              </CreateDietBtn>
            </>
          )}
        </ContentContainer>

        {/* 끼니 정보 요약 */}
        <SummaryContainer>
          <CartSummary />
        </SummaryContainer>
      </ScrollView>

      {/* 주문 버튼 */}
      <BtnBottomCTA
        btnStyle={isEmpty ? 'inactivated' : 'activated'}
        width={SCREENWIDTH - 16}
        disabled={isEmpty}
        onPress={() => {
          navigation.navigate('OrderNav', {screen: 'Order'});
        }}>
        <BtnText>
          식품 총 {totalPrice && commaToNum(totalPrice)}원 주문하기
        </BtnText>
      </BtnBottomCTA>

      {/* CreateDiet 알럿 */}
      <DAlert
        alertShow={createAlertShow}
        renderContent={() =>
          addAlertStatus === 'limit' ? (
            <CreateLimitAlertContent />
          ) : addAlertStatus === 'empty' ? (
            <CommonAlertContent
              text={`비어있는 끼니를\n먼저 구성하고 이용해보세요`}
            />
          ) : (
            <></>
          )
        }
        onConfirm={() => {
          setCreateAlertShow(false);
        }}
        onCancel={() => setCreateAlertShow(false)}
        NoOfBtn={1}
      />

      {/* 끼니 수량 조절용 BottomSheet */}
      <DBottomSheet
        alertShow={numberPickerShow}
        setAlertShow={setNumberPickerShow}
        renderContent={() => (
          <NumberPickerContent
            setNumberPickerShow={setNumberPickerShow}
            dietDetailData={detailDataToNoControl}
          />
        )}
        onCancel={() => setNumberPickerShow(false)}
      />
    </Container>
  );
};

export default Cart;

// style //
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.white};
`;
const ContentContainer = styled.SafeAreaView`
  flex: 1;
  padding: 0px 8px 16px 8px;
  background-color: ${colors.backgroundLight2};
`;

const CreateDietBtn = styled.TouchableOpacity`
  height: 48px;
  width: 100%;
  margin-top: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${colors.white};
`;
const LeftBar = styled.View`
  position: absolute;
  left: 0px;
  width: 4px;
  height: 48px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: ${colors.dark};
`;

const PlusImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const CreateDietText = styled(TextSub)`
  margin-left: 8px;
  font-size: 16px;
  font-weight: bold;
`;

const SummaryContainer = styled.View`
  padding: 0px 8px 60px 8px;
`;

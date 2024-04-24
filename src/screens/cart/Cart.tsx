// react, RN, 3rd
import {useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';

// doobi util, redux, etc
import colors from '../../shared/colors';
import {commaToNum, sumUpDietTotal} from '../../shared/utils/sumUp';
import {
  setCartAcActive,
  setCurrentDiet,
} from '../../features/reduxSlices/commonSlice';
import {SCREENWIDTH} from '../../shared/constants';
import {icons} from '../../shared/iconSource';
import {getDietAddStatus} from '../../shared/utils/getDietAddStatus';
import {RootState} from '../../app/store/reduxStore';

// doobi Component
import {HorizontalSpace, TextSub} from '../../shared/ui/styledComps';
import CartSummary from '../../components/cart/CartSummary';
import DAlert from '../../shared/ui/DAlert';
import CreateLimitAlertContent from '../../components/common/alert/CreateLimitAlertContent';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';
import MenuNumSelectContent from '../../components/cart/MenuNumSelectContent';
import DBottomSheet from '../../components/common/bottomsheet/DBottomSheet';

// react-query
import {
  useCreateDiet,
  useGetDietDetailEmptyYn,
  useListDiet,
  useListDietTotal,
} from '../../shared/api/queries/diet';
import {findDietSeq, findEmptyDietSeq} from '../../shared/utils/findDietSeq';
import {setFoodToOrder} from '../../features/reduxSlices/orderSlice';
import CtaButton from '../../shared/ui/CtaButton';
import {getMenuAcContent} from '../../shared/utils/menuAccordion';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';

const Cart = () => {
  // redux
  const dispatch = useDispatch();
  const {currentDietNo, cartAcActive} = useSelector(
    (state: RootState) => state.common,
  );
  const {shippingPrice} = useSelector((state: RootState) => state.order);

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: dietData} = useListDiet();
  const {data: dietEmptyData} = useGetDietDetailEmptyYn();
  const dietTotalData =
    !!dietData && useListDietTotal(dietData, {enabled: !!dietData});

  // state
  const [createAlertShow, setCreateAlertShow] = useState(false);
  const [menuNumSelectShow, setMenuNumSelectShow] = useState(false);
  const [dietNoToNumControl, setDietNoToNumControl] = useState<string>('');

  // navigation
  const {navigate} = useNavigation();
  // const {navigate} = navigation;
  const isFocused = useIsFocused();

  // 끼니 추가할 수 있는지 여부
  const addAlertStatus = getDietAddStatus(dietData, dietEmptyData);

  // dietTotalData가 바뀔때마다 변경되어야 하는 정보들
  const {
    dTDataStatus,
    dTData,
    menuNum,
    productNum,
    priceTotal,
    accordionContent,
    emptyDietSeq,
  } = useMemo(() => {
    const dTDataStatus =
      dietTotalData && dietTotalData.map(menu => menu.isLoading).includes(true)
        ? 'isLoading'
        : 'isSuccess';
    const dTData =
      dietTotalData && dTDataStatus === 'isSuccess'
        ? dietTotalData?.map((d, idx) => (d.data ? d.data : []))
        : undefined;

    // 끼니수량, 상품수량, 총 가격, 배송비
    const {menuNum, productNum, priceTotal} = sumUpDietTotal(dTData);

    // 비어있는 끼니 확인
    const emptyDietSeq = findEmptyDietSeq(dTData);

    // accordion
    const accordionContent = getMenuAcContent({
      currentDietNo,
      bLData: baseLineData,
      dData: dietData,
      dTData,
      screen: 'Cart',
      setMenuNumSelectShow,
      setDietNoToNumControl,
    });

    return {
      dTDataStatus,
      dTData,
      menuNum,
      productNum,
      priceTotal,
      accordionContent,
      emptyDietSeq,
    };
  }, [dietTotalData]);

  // Fn
  const updateSections = (activeSections: number[]) => {
    dispatch(setCartAcActive(activeSections));
    if (activeSections.length === 0) return;
    const currentIdx = activeSections[0];
    const currentDietNo = dietData && dietData[currentIdx].dietNo;
    currentDietNo && dispatch(setCurrentDiet(currentDietNo));
  };

  // const onCreateDiet = () => {
  //   if (addAlertStatus === 'possible') {
  //     createDietMutation.mutate();
  //     return;
  //   }
  //   setCreateAlertShow(true);
  // };

  // useEffect
  // 장바구니 이동했을 때 현재 끼니의 accordion을 열어줌
  useEffect(() => {
    isFocused
      ? dispatch(setCartAcActive([findDietSeq(dietData, currentDietNo).idx]))
      : dispatch(setCartAcActive([]));
  }, [isFocused]);

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentContainer>
          {dTDataStatus === 'isLoading' || !dTData ? (
            <ActivityIndicator style={{marginTop: 16}} />
          ) : (
            <Accordion
              activeSections={cartAcActive}
              sections={accordionContent}
              touchableComponent={TouchableOpacity}
              renderHeader={(section, _, isActive) =>
                isActive ? section.activeHeader : section.inactiveHeader
              }
              renderContent={section => section.content}
              renderFooter={() => <HorizontalSpace height={24} />}
              onChange={updateSections}
            />
          )}
        </ContentContainer>

        {/* 끼니 정보 요약 */}
        <CartSummary
          setMenuNumSelectShow={setMenuNumSelectShow}
          setDietNoToNumControl={setDietNoToNumControl}
        />
      </ScrollView>

      {/* 주문 버튼 */}
      <CtaButton
        btnStyle="active"
        style={{
          backgroundColor: colors.dark,
          width: SCREENWIDTH - 32,
          alignSelf: 'center',
          position: 'absolute',
          bottom: 8,
        }}
        btnText={`주문하기 (${commaToNum(priceTotal + shippingPrice)}원)`}
        onPress={() => {
          if (addAlertStatus === 'empty') {
            // 주문시 비어있는 끼니 있으면 일단 막기
            setCreateAlertShow(true);
            return;
          }
          !!dTData && dispatch(setFoodToOrder(dTData));
          navigate('Order');
        }}
      />

      <DAlert
        alertShow={createAlertShow}
        renderContent={() =>
          addAlertStatus === 'limit' ? (
            <CreateLimitAlertContent />
          ) : addAlertStatus === 'empty' ? (
            <CommonAlertContent
              text={`비어있는 끼니를\n먼저 구성하고 이용해보세요\n(${emptyDietSeq})`}
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
        alertShow={menuNumSelectShow}
        setAlertShow={setMenuNumSelectShow}
        renderContent={() => (
          <MenuNumSelectContent
            setMenuNumSelectShow={setMenuNumSelectShow}
            dietNoToNumControl={dietNoToNumControl}
          />
        )}
        onCancel={() => setMenuNumSelectShow(false)}
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
const ContentContainer = styled.View`
  flex: 1;
  padding: 16px 8px 40px 8px;
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
  background-color: ${colors.inactivated};
`;

const PlusImage = styled.Image`
  width: 24px;
  height: 24px;
`;

const CreateDietText = styled(TextSub)`
  margin-left: 8px;
  font-size: 14px;
`;

const SummaryContainer = styled.View`
  padding: 0px 8px 60px 8px;
`;

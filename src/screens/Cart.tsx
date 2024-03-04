// react, RN, 3rd
import {useEffect, useMemo, useRef, useState} from 'react';
import {ScrollView, TouchableOpacity, ActivityIndicator} from 'react-native';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import Accordion from 'react-native-collapsible/Accordion';

// doobi util, redux, etc
import colors from '../styles/colors';
import {commaToNum, sumUpDietTotal} from '../util/sumUp';
import {
  setCurrentDiet,
  setMenuActiveSection,
} from '../stores/slices/commonSlice';
import {SCREENWIDTH} from '../constants/constants';
import {icons} from '../assets/icons/iconSource';
import {getDietAddStatus} from '../util/getDietAddStatus';
import {RootState} from '../stores/store';

// doobi Component
import {BtnBottomCTA, BtnText, Row, TextSub} from '../styles/styledConsts';
import CartSummary from '../components/cart/CartSummary';
import DAlert from '../components/common/alert/DAlert';
import CreateLimitAlertContent from '../components/common/alert/CreateLimitAlertContent';
import CommonAlertContent from '../components/common/alert/CommonAlertContent';
import MenuNumSelectContent from '../components/cart/MenuNumSelectContent';
import DBottomSheet from '../components/common/bottomsheet/DBottomSheet';
import AccordionContent from '../components/cart/AccordionContent';
import AccordionInactiveHeader from '../components/cart/AccordionInactiveHeader';
import AccordionActiveHeader from '../components/cart/AccordionActiveHeader';

// react-query
import {
  useCreateDiet,
  useGetDietDetailEmptyYn,
  useListDiet,
  useListDietTotal,
} from '../query/queries/diet';
import {findDietSeq, findEmptyDietSeq} from '../util/findDietSeq';
import {setFoodToOrder} from '../stores/slices/orderSlice';

const Cart = () => {
  // redux
  const dispatch = useDispatch();
  const {currentDietNo, menuActiveSection} = useSelector(
    (state: RootState) => state.common,
  );
  const {shippingPrice} = useSelector((state: RootState) => state.order);

  // react-query
  const {data: dietData} = useListDiet();
  const {data: dietEmptyData} = useGetDietDetailEmptyYn();
  const dietTotalData =
    !!dietData && useListDietTotal(dietData, {enabled: !!dietData});
  const createDietMutation = useCreateDiet();

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
    totalStatus,
    dietTotal,
    menuNum,
    productNum,
    priceTotal,
    ACCORDION_CONTENT,
    emptyDietSeq,
  } = useMemo(() => {
    const totalStatus =
      dietTotalData && dietTotalData.map(menu => menu.isLoading).includes(true)
        ? 'isInitialLoading'
        : 'isInitialLoaded';

    // reactQueries data
    const dietTotal = dietTotalData
      ? dietTotalData?.map((d, idx) => (d.data ? d.data : []))
      : undefined;
    // 끼니수량, 상품수량, 총 가격, 배송비
    const {menuNum, productNum, priceTotal} = sumUpDietTotal(dietTotal);

    // 비어있는 끼니 확인
    const emptyDietSeq = findEmptyDietSeq(dietTotal);

    // accordion
    const ACCORDION_CONTENT =
      dietData && dietTotalData && totalStatus === 'isInitialLoaded'
        ? dietData.map((menu, idx) => {
            return {
              inactiveHeader: (
                <AccordionInactiveHeader
                  idx={idx}
                  dietNo={menu.dietNo}
                  dietSeq={menu.dietSeq}
                  dietDetailData={dietTotalData[idx].data ?? []}
                  // setActiveSections={setActiveSections}
                  setDietNoToNumControl={setDietNoToNumControl}
                  setMenuNumSelectShow={setMenuNumSelectShow}
                />
              ),
              content: (
                <AccordionContent
                  dietNo={menu.dietNo}
                  dietDetailData={dietTotalData[idx].data ?? []}
                  setDietNoToNumControl={setDietNoToNumControl}
                  setMenuNumSelectShow={setMenuNumSelectShow}
                />
              ),
              activeHeader: (
                <AccordionActiveHeader
                  idx={idx}
                  dietNo={menu.dietNo}
                  dietSeq={menu.dietSeq}
                  dietDetailData={dietTotalData[idx].data ?? []}
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

    return {
      totalStatus,
      dietTotal,
      menuNum,
      productNum,
      priceTotal,
      ACCORDION_CONTENT,
      emptyDietSeq,
    };
  }, [dietTotalData]);

  // Fn
  const updateSections = (activeSections: number[]) => {
    dispatch(setMenuActiveSection(activeSections));
    if (activeSections.length === 0) return;
    const currentIdx = activeSections[0];
    const currentDietNo = dietData && dietData[currentIdx].dietNo;
    currentDietNo && dispatch(setCurrentDiet(currentDietNo));
  };

  const onCreateDiet = () => {
    if (addAlertStatus === 'possible') {
      createDietMutation.mutate();
      return;
    }
    setCreateAlertShow(true);
  };

  // useEffect
  // 장바구니 이동했을 때 현재 끼니의 accordion을 열어줌
  // navigation addListener는 redux currentDietNo가 동기화가 안됨
  // => useIsFocused 사용
  useEffect(() => {
    if (isFocused) {
      const {idx} = findDietSeq(dietData, currentDietNo);
      dispatch(setMenuActiveSection([idx]));
    }
  }, [isFocused]);

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
              <CreateDietBtn onPress={onCreateDiet}>
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
                    <CreateDietText>끼니 추가</CreateDietText>
                  </Row>
                )}
              </CreateDietBtn>
            </>
          )}
        </ContentContainer>

        {/* 끼니 정보 요약 */}
        <CartSummary
          setMenuNumSelectShow={setMenuNumSelectShow}
          setDietNoToNumControl={setDietNoToNumControl}
        />
      </ScrollView>

      {/* 주문 버튼 */}
      <BtnBottomCTA
        btnStyle={'activated'}
        width={SCREENWIDTH - 16}
        onPress={() => {
          if (addAlertStatus === 'empty') {
            // 비어있을 때 끼니 추가 안되는 것 방지하는 코드랑 중복
            setCreateAlertShow(true);
            return;
          }
          !!dietTotal && dispatch(setFoodToOrder(dietTotal));
          navigate('Order');
        }}>
        <BtnText>주문하기 ({commaToNum(priceTotal + shippingPrice)}원)</BtnText>
      </BtnBottomCTA>

      {/* CreateDiet 알럿 */}
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

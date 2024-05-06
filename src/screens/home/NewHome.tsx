// RN
import {useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';

// 3rd
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components/native';
import PieChart from 'react-native-pie-chart';

// doobi
import {RootState} from '../../app/store/reduxStore';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {
  useDeleteDiet,
  useListDiet,
  useListDietDetailAll,
  useListDietTotal,
} from '../../shared/api/queries/diet';
import {useListOrder} from '../../shared/api/queries/order';

import {loadBaseLineData} from '../../features/reduxSlices/userInputSlice';
import colors from '../../shared/colors';
import {icons} from '../../shared/iconSource';
import {regroupByBuyDateAndDietNo} from '../../shared/utils/regroup';
import {
  commaToNum,
  getTotalShippingPriceFromDTData,
  sumUpDietTotal,
} from '../../shared/utils/sumUp';

import {
  Col,
  Container,
  HorizontalSpace,
  Icon,
  Row,
  TextMain,
  TextSub,
} from '../../shared/ui/styledComps';
import NutrTarget from './ui/NutrTarget';
import ShadowView from '../../shared/ui/ShadowView';
import CtaButton from '../../shared/ui/CtaButton';
import {
  setCurrentDiet,
  setTotalFoodList,
  setTutorialProgress,
} from '../../features/reduxSlices/commonSlice';
import {useListProduct} from '../../shared/api/queries/product';
import {convertQsResultToData} from '../../shared/utils/queriesData';
import LastOrderNutr from './ui/LastOrderNutr';
import {parseDate} from '../../shared/utils/dateParsing';
import {getTotalChecklist} from '../../shared/utils/asyncStorage';
import {flatOrderMenuWithQty} from '../checklist/util/menuFlat';
import DTPScreen from '../../shared/ui/DTPScreen';
import {SCREENWIDTH} from '../../shared/constants';
import {
  setFoodToOrder,
  setShippingPrice,
} from '../../features/reduxSlices/orderSlice';
import DTooltip from '../../components/common/tooltip/DTooltip';

const NewHome = () => {
  // navigation
  const {navigate} = useNavigation();
  const isFocused = useIsFocused();

  // redux
  const dispatch = useDispatch();
  const {
    currentDietNo,
    totalFoodListIsLoaded,
    isTutorialMode,
    tutorialProgress,
  } = useSelector((state: RootState) => state.common);
  const {applied: appliedSortFilter} = useSelector(
    (state: RootState) => state.sortFilter,
  );

  // useRef (튜토리얼 식단 구성하기 버튼 위치)
  const scrollRef = useRef<ScrollView | null>(null);
  const ctaBtnRef = useRef<TouchableOpacity | null>(null);

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: dietData, refetch: refetchListDiet} = useListDiet();
  const deleteDietMutation = useDeleteDiet();
  const {data: dietDetailAllData} = useListDietDetailAll();
  const dietTotalData = useListDietTotal(dietData, {enabled: !!dietData});
  const {data: orderData} = useListOrder();
  const {data: listProductData} = useListProduct(
    {
      dietNo: currentDietNo,
      appliedSortFilter,
    },
    {
      enabled: currentDietNo ? true : false,
    },
  );

  // useState
  const [tutorialCtaBtnPy, setTutorialCtaBtnPy] = useState(0);
  const [showEveryList, setShowEveryList] = useState(false);
  const [totalChecklist, setTotalChecklist] = useState<{
    [key: string]: string[];
  }>({}); // asyncStorage checklist 전체 데이터

  // useMemo
  const {dTDataStatus, dTData, priceTotal, shippingPrice} = useMemo(() => {
    const {dTDataStatus, dTData} = convertQsResultToData(dietTotalData);
    const {priceTotal} = sumUpDietTotal(dTData);
    const shippingPrice = dTData ? getTotalShippingPriceFromDTData(dTData) : 0;

    return {
      dTDataStatus,
      dTData,
      priceTotal,
      shippingPrice,
    };
  }, [dietTotalData]);
  // orderData regroup.
  const {orderGroupedDataFlatten} = useMemo(() => {
    if (!orderData) return {orderGroupedDataFlatten: []};
    const orderGroupedData = regroupByBuyDateAndDietNo(orderData);
    let orderGroupedDataFlatten = [];
    for (let i = 0; i < orderGroupedData.length; i++) {
      const flattenData = flatOrderMenuWithQty(orderGroupedData[i]);
      orderGroupedDataFlatten.push(flattenData);
    }
    return {orderGroupedDataFlatten};
  }, [orderData]);

  // etc
  const flattenOrderData = showEveryList
    ? orderGroupedDataFlatten
    : orderGroupedDataFlatten.slice(0, 4);

  // 현재 식단 상태, 주문 상태에 따른 카드 제목 및 버튼 텍스트
  const isDietEmpty = dietDetailAllData?.length === 0;
  const isOrderEmpty = flattenOrderData.length === 0;
  const ctaBtnText = isDietEmpty ? '식단 구성하기' : '식단 구매하기';
  const menuCardTitle = isDietEmpty
    ? '새로운 식단 구성을 기다리고 있어요'
    : '구매 대기 중인 끼니가 있어요';
  const checklistCardTitle = isOrderEmpty
    ? '아직 주문한 끼니가 없어요'
    : '식사하실 때 체크해보세요';

  // fn
  const onCtaPressed = () => {
    if (isDietEmpty) {
      navigate('BottomTabNav', {screen: 'Diet'});
      return;
    }
    if (!dTData) return;
    dTData && dispatch(setFoodToOrder(dTData));
    dispatch(setShippingPrice(shippingPrice));
    navigate('Order');
  };

  // useEffect
  useEffect(() => {
    baseLineData && dispatch(loadBaseLineData(baseLineData));
  }, [baseLineData]);

  // 앱 시작할 때 내가 어떤 끼니를 보고 있는지 redux에 저장해놓기 위해 필요함
  useEffect(() => {
    const initializeDiet = async () => {
      const dietData = (await refetchListDiet()).data;
      if (!dietData || dietData.length === 0) return;
      const firstDietNo = dietData[0].dietNo;
      dispatch(setCurrentDiet(firstDietNo));
    };

    initializeDiet();
  }, []);

  // 처음 앱 켰을 때 totalFoodList를 redux에 저장해놓고 끼니 자동구성에 사용
  useEffect(() => {
    if (!listProductData) return;
    if (totalFoodListIsLoaded) return;
    dispatch(setTotalFoodList(listProductData));
  }, [listProductData]);

  // asyncStorage 체크리스트 데이터 가져오기
  useEffect(() => {
    if (!isFocused) return;
    const loadCheckList = async () => {
      const list = await getTotalChecklist();
      setTotalChecklist(list);
    };
    loadCheckList();
  }, [isFocused]);

  // useEffect 튜토리얼모드인 경우 끼니 있으면 모두 삭제
  // + 스크롤 맨 위로 올리고 튜토리얼 시작 버튼 위치 저장
  useEffect(() => {
    if (!isFocused) return;
    if (!isTutorialMode) return;
    if (tutorialProgress !== 'Start') return;

    setTimeout(() => {
      ctaBtnRef?.current?.measure((fx, fy, width, height, px, py) => {
        scrollRef?.current?.scrollTo({y: 0, animated: true});
        setTutorialCtaBtnPy(py);
      });
    }, 1500);

    const deleteAllDiet = async () => {
      const dietNoList = dietData?.map(d => d.dietNo) || [];
      const deleteMutations = dietNoList.map(dietNo =>
        deleteDietMutation.mutateAsync({dietNo}),
      );
      await Promise.all(deleteMutations);
    };
    deleteAllDiet();
  }, [tutorialProgress]);

  return (
    <Container
      style={{
        backgroundColor: colors.backgroundLight2,
        paddingLeft: 0,
        paddingRight: 0,
      }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{paddingBottom: 64}}
        showsVerticalScrollIndicator={false}>
        {/* 상단 프로필 */}
        <ProfileBox>
          <Row style={{paddingHorizontal: 16}}>
            <Nickname>{baseLineData?.nickNm}</Nickname>
            <Nickname style={{fontWeight: 'normal'}}>님</Nickname>
          </Row>
          <SubText style={{paddingHorizontal: 16, marginTop: 2}}>
            다이어트메이트가 즐거운 식단실천을 응원합니다
          </SubText>
          <HighlightBox>
            <MainText>한 끼 목표 영양</MainText>
            <TargetChangeBtn
              onPress={() => navigate('UserInput', {from: 'NewHome'})}>
              <SubText>목표변경</SubText>
              <Icon size={20} source={icons.arrowRight_20} />
            </TargetChangeBtn>
          </HighlightBox>
          <HorizontalSpace height={16} />
          {baseLineData && <NutrTarget baseLineData={baseLineData} />}
        </ProfileBox>

        {/* 현재 식단 카드 (식단 있으면 구매, 없으면 식단구성버튼)*/}
        <HorizontalSpace height={40} />
        <ShadowView
          opacity={0.16}
          style={{
            marginHorizontal: 16,
          }}>
          <Card>
            {dTDataStatus === 'isLoading' ? (
              <ActivityIndicator size="small" color={colors.main} />
            ) : (
              <Col>
                <Row style={{justifyContent: 'space-between'}}>
                  <Row>
                    <Icon source={icons.warning_24} />
                    <CardTitle>{menuCardTitle}</CardTitle>
                  </Row>

                  {!isDietEmpty && (
                    <TargetChangeBtn
                      onPress={() =>
                        navigate('BottomTabNav', {screen: 'Diet'})
                      }>
                      <SubText>끼니상세</SubText>
                      <Icon size={20} source={icons.arrowRight_20} />
                    </TargetChangeBtn>
                  )}
                </Row>
                {!isDietEmpty && (
                  <Col style={{marginTop: 24}}>
                    <Row>
                      <Icon source={icons.menu_24} />
                      <CardDesc>{dTData?.length}개 끼니</CardDesc>
                    </Row>
                    <Row style={{marginTop: 8}}>
                      <Icon source={icons.card_24} />
                      <CardDesc>{commaToNum(priceTotal)} 원</CardDesc>
                    </Row>
                  </Col>
                )}
                <CtaButton
                  ref={ctaBtnRef}
                  onPress={onCtaPressed}
                  btnStyle="activeDark"
                  btnText={ctaBtnText}
                  style={{marginTop: 40}}
                />
              </Col>
            )}
          </Card>
        </ShadowView>

        {/* 주문끼니 체크리스트*/}
        <ShadowView
          opacity={0.16}
          style={{
            marginHorizontal: 16,
            marginTop: 40,
          }}>
          <Card>
            <Row>
              {isOrderEmpty && <Icon source={icons.warning_24} />}
              <CardTitle>{checklistCardTitle}</CardTitle>
            </Row>

            {!isOrderEmpty && <HorizontalSpace height={40} />}
            {!isOrderEmpty &&
              flattenOrderData.map((order, idx) => {
                const numerator =
                  totalChecklist[order[0][0].orderNo]?.length || 0;
                const denominator = order.length;
                const percentage = Math.round((numerator / denominator) * 100);
                return (
                  <ShadowView key={idx}>
                    <CheckListBox
                      onPress={() =>
                        navigate('Checklist', {
                          order,
                          checklist: totalChecklist[order[0][0].orderNo],
                        })
                      }>
                      <LeftBar />
                      <CheckListTitle>
                        {parseDate(order[0][0].buyDate)} 주문
                      </CheckListTitle>
                      <Row>
                        <CheckListSubTitle>
                          {percentage}% 완료
                        </CheckListSubTitle>

                        {percentage === 100 ? (
                          <Icon
                            style={{marginLeft: 8, zIndex: 2}}
                            source={icons.checkRoundCheckedPurple_24}
                          />
                        ) : (
                          <Col
                            style={{
                              width: 24,
                              height: 24,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginLeft: 8,
                            }}>
                            <PieChart
                              series={[numerator, denominator - numerator]}
                              widthAndHeight={20}
                              style={{zIndex: 2}}
                              sliceColor={[colors.main, colors.white]}
                              coverRadius={0.6}
                            />
                          </Col>
                        )}
                      </Row>
                      {percentage === 100 && <OpacityView />}
                    </CheckListBox>
                  </ShadowView>
                );
              })}
            {orderGroupedDataFlatten.length > 4 && (
              <LoadMoreBtn onPress={() => setShowEveryList(v => !v)}>
                <Icon
                  source={showEveryList ? icons.arrowUp_20 : icons.arrowDown_20}
                />
              </LoadMoreBtn>
            )}
          </Card>
        </ShadowView>

        {/* 마지막 주문정보 카드*/}
        {!isOrderEmpty && (
          <ShadowView
            opacity={0.16}
            style={{
              marginHorizontal: 16,
              marginTop: 40,
            }}>
            <Card>
              <Row style={{justifyContent: 'space-between'}}>
                <Row>
                  <Icon source={icons.checkRoundCheckedGreen_24} />
                  <CardTitle>마지막 주문정보</CardTitle>
                </Row>
                <TargetChangeBtn onPress={() => navigate('OrderHistory')}>
                  <SubText>주문전체정보</SubText>
                  <Icon size={20} source={icons.arrowRight_20} />
                </TargetChangeBtn>
              </Row>
              <HorizontalSpace height={40} />
              <LastOrderNutr lastOrder={orderGroupedDataFlatten[0]} />
              <Col style={{marginTop: 24}}>
                <Row>
                  <Icon source={icons.calendar_24} />
                  <CardDesc>
                    {orderGroupedDataFlatten[0][0][0].buyDate}
                  </CardDesc>
                </Row>
                <Row style={{marginTop: 8}}>
                  <Icon source={icons.menu_24} />
                  <CardDesc>
                    {orderGroupedDataFlatten[0].length}개 끼니
                  </CardDesc>
                </Row>
                <Row style={{marginTop: 8}}>
                  <Icon source={icons.card_24} />
                  <CardDesc>
                    {commaToNum(orderGroupedDataFlatten[0][0][0].orderPrice)} 원
                  </CardDesc>
                </Row>
              </Col>
            </Card>
          </ShadowView>
        )}

        {/* 튜토리얼 */}
        <DTPScreen
          contentDelay={2000}
          visible={isTutorialMode && tutorialProgress === 'Start'}
          renderContent={() => (
            <>
              <DTooltip
                tooltipShow={true}
                boxTop={tutorialCtaBtnPy - 36}
                text="식단구성을 시작해봐요!"
                boxLeft={32}
              />
              <CtaButton
                onPress={() => {
                  dispatch(setTutorialProgress('AddMenu'));
                  navigate('BottomTabNav', {screen: 'Diet'});
                }}
                btnStyle="active"
                btnText={ctaBtnText}
                style={{
                  width: SCREENWIDTH - 32 - 32,
                  marginTop: tutorialCtaBtnPy,
                }}
              />
            </>
          )}
        />
      </ScrollView>
    </Container>
  );
};

export default NewHome;

const ProfileBox = styled.View`
  padding: 24px 0px;
  background-color: ${colors.white};
`;

const Nickname = styled(TextMain)`
  font-size: 20px;
  font-weight: bold;
  line-height: 24px;
`;

const SubText = styled(TextSub)`
  font-size: 12px;
  line-height: 16px;
`;
const MainText = styled(TextMain)`
  font-size: 14px;
  line-height: 20px;
`;

const HighlightBox = styled.View`
  flex-direction: row;
  width: 100%;
  height: 32px;
  background-color: ${colors.highlight2};
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0px 16px;
`;

const TargetChangeBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

const Card = styled.View`
  padding: 24px 16px 32px 16px;
  background-color: ${colors.white};
  border-radius: 10px;
`;

const CardTitle = styled(MainText)`
  font-weight: bold;
  margin-left: 4px;
`;

const CardDesc = styled(MainText)`
  margin-left: 4px;
`;

const CheckListBox = styled.TouchableOpacity`
  background-color: ${colors.white};
  width: 100%;
  height: 72px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  border-width: 0.5px;
  border-color: ${colors.lineLight};
  padding: 0px 16px;
`;

const LeftBar = styled.View<{screen?: 'Home' | 'Diet' | string}>`
  position: absolute;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: ${colors.inactivated};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const CheckListTitle = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
`;

const CheckListSubTitle = styled(TextMain)`
  font-size: 14px;
  line-height: 18px;
`;

const OpacityView = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: ${colors.whiteOpacity70};
  z-index: 1;
`;

const LoadMoreBtn = styled.TouchableOpacity`
  width: 48px;
  height: 24px;
  align-self: center;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
`;

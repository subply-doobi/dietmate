// RN
import {useEffect, useMemo, useRef, useState} from 'react';

// 3rd
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {useHeaderHeight} from '@react-navigation/elements';
import Accordion from 'react-native-collapsible/Accordion';

// doobi
import colors from '../../shared/colors';
import {RootState} from '../../app/store/reduxStore';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {
  useCreateDiet,
  useDeleteDiet,
  useListDiet,
  useListDietTotal,
} from '../../shared/api/queries/diet';

import {findEmptyDietSeq} from '../../shared/utils/findDietSeq';
import {getMenuAcContent} from '../../shared/utils/menuAccordion';
import {
  Col,
  Container,
  HorizontalSpace,
  Icon,
  TextMain,
} from '../../shared/ui/styledComps';
import {
  setCurrentDiet,
  setIsTutorialMode,
  setMenuAcActive,
  setTutorialEnd,
  setTutorialProgress,
  setTutorialStart,
} from '../../features/reduxSlices/commonSlice';
import {ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import CtaButton from '../../shared/ui/CtaButton';
import {SCREENHEIGHT, SCREENWIDTH} from '../../shared/constants';
import {setFoodToOrder} from '../../features/reduxSlices/orderSlice';
import {convertQsResultToData} from '../../shared/utils/queriesData';
import DBottomSheet from '../../components/common/bottomsheet/DBottomSheet';
import MenuNumSelectContent from '../../components/cart/MenuNumSelectContent';
import DAlert from '../../shared/ui/DAlert';
import {getAddDietStatusFrDTData} from '../../shared/utils/getDietAddStatus';
import CommonAlertContent from '../../components/common/alert/CommonAlertContent';
import CreateDietAlert from './ui/CreateDietAlert';
import {
  commaToNum,
  getTotalShippingPriceFromDTData,
  sumUpDietTotal,
} from '../../shared/utils/sumUp';
import {
  getNotShowAgainList,
  updateNotShowAgainList,
} from '../../shared/utils/asyncStorage';
import DTPScreen from '../../shared/ui/DTPScreen';
import DTooltip from '../../components/common/tooltip/DTooltip';
import AccordionCtaBtns from '../../components/menuAccordion/AccordionCtaBtns';
import NutrientsProgress from '../../components/common/nutrient/NutrientsProgress';
import LoadingAlertContent from './ui/LoadingAlertContent';
import {icons} from '../../shared/iconSource';
import {IDietData} from '../../shared/api/types/diet';
import ErrorAlertContent from './ui/ErrorAlertContent';
import CartSummary from '../../components/cart/CartSummary';

const Diet = () => {
  // navigation
  const {navigate} = useNavigation();
  const headerHeight = useHeaderHeight();
  const bottomTabBarHeight = useBottomTabBarHeight();

  // redux
  const dispatch = useDispatch();
  const {
    currentDietNo,
    menuAcActive,
    isTutorialMode,
    tutorialProgress,
    autoMenuStatus,
  } = useSelector((state: RootState) => state.common);

  // react-query
  const {data: bLData} = useGetBaseLine();
  const {data: dietData} = useListDiet();
  const dietTotalData =
    !!dietData && useListDietTotal(dietData, {enabled: !!dietData});
  const createDietMutation = useCreateDiet();
  const deleteDietMutation = useDeleteDiet();

  // useState
  const [createAlertShow, setCreateAlertShow] = useState(false);
  const [numOfCreateDiet, setNumOfCreateDiet] = useState(5);
  const [isCreating, setIsCreating] = useState(false);
  const [createNAAlertShow, setCreateNAAlertShow] = useState(false);
  const [menuNumSelectShow, setMenuNumSelectShow] = useState(false);
  const [dietNoToNumControl, setDietNoToNumControl] = useState<string>('');

  // useRef
  const scrollRef = useRef<ScrollView>(null);
  const autoMenuBtnRef = useRef<TouchableOpacity>(null);

  // useMemo
  const {
    dTDataStatus,
    dTData,
    accordionContent,
    emptyDietSeq,
    shippingPrice,
    priceTotal,
  } = useMemo(() => {
    const {dTDataStatus, dTData} = convertQsResultToData(dietTotalData);
    // 비어있는 끼니 확인
    const emptyDietSeq = findEmptyDietSeq(dTData);
    const shippingPrice = dTData ? getTotalShippingPriceFromDTData(dTData) : 0;
    const {priceTotal} = sumUpDietTotal(dTData);

    // accordion
    const accordionContent = getMenuAcContent({
      currentDietNo,
      bLData: bLData,
      dData: dietData,
      dTData,
      screen: 'Diet',
      setMenuNumSelectShow,
      setDietNoToNumControl,
    });

    return {
      dTDataStatus,
      dTData,
      accordionContent,
      emptyDietSeq,
      shippingPrice,
      priceTotal,
    };
  }, [dietTotalData]);

  // etc
  const {status: addDietStatus, text: addDietNAText} =
    getAddDietStatusFrDTData(dTData);

  // fn
  const updateSections = (activeSections: number[]) => {
    dispatch(setMenuAcActive(activeSections));
    if (activeSections.length === 0) return;
    const currentIdx = activeSections[0];
    const currentDietNo = dietData && dietData[currentIdx].dietNo;
    currentDietNo && dispatch(setCurrentDiet(currentDietNo));
  };

  const onAddCreatePressed = () => {
    if (!dTData) return;
    setIsCreating(false);
    const currentNumOfMenu = dTData.length;
    if (addDietStatus === 'possible') {
      currentNumOfMenu < 5
        ? setNumOfCreateDiet(5 - currentNumOfMenu)
        : setNumOfCreateDiet(1);
      setCreateAlertShow(true);
      return;
    }
    setCreateNAAlertShow(true);
  };

  const onCreateDiet = async () => {
    setIsCreating(true);
    const arr = new Array(numOfCreateDiet).fill(0);
    let firstAddedDietNo = '';
    for (let i = 0; i < arr.length; i++) {
      const res = await createDietMutation.mutateAsync({setDietNo: false});
      if (i === 0) {
        firstAddedDietNo = res.dietNo;
      }
    }
    dispatch(setCurrentDiet(firstAddedDietNo));
    isTutorialMode && dispatch(setTutorialProgress('AddFood'));

    setIsCreating(false);
    setCreateAlertShow(false);
    // delay for rendering
    isTutorialMode &&
      setTimeout(() => {
        dispatch(setMenuAcActive([0]));
      }, 200);
  };

  // useEffect 튜토리얼모드인 경우 끼니 있으면 모두 삭제
  useEffect(() => {
    if (!isTutorialMode) return;
    if (tutorialProgress !== 'AddMenu') return;
    const deleteAllDiet = async () => {
      const dietNoList = dietData?.map(d => d.dietNo) || [];
      const deleteMutations = dietNoList.map(dietNo =>
        deleteDietMutation.mutateAsync({dietNo}),
      );
      await Promise.all(deleteMutations);
    };
    deleteAllDiet();
  }, [tutorialProgress]);

  // AutoMenu tutorial인 경우 스크롤 자동구성 버튼 위치로 내리기
  // Complete tutorial인 경우는 스크롤 맨 위로
  useEffect(() => {
    if (isTutorialMode && tutorialProgress === 'Complete') {
      scrollRef.current?.scrollTo({y: 0, animated: true});
      return;
    }
    if (isTutorialMode && tutorialProgress === 'AutoMenu') {
      setTimeout(
        () =>
          autoMenuBtnRef?.current?.measure((fx, fy, width, height, px, py) => {
            scrollRef.current?.scrollTo({
              y:
                py -
                (SCREENHEIGHT -
                  (height + headerHeight + bottomTabBarHeight + 40 + 60)),
              animated: true,
            });
          }),
        1500,
      );
      return;
    }
  }, [tutorialProgress]);

  // render
  if (dTDataStatus === 'isLoading' || isCreating) {
    return (
      <Container style={{justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} color={colors.main} />
      </Container>
    );
  }

  return (
    <Container
      style={{
        backgroundColor: colors.backgroundLight2,
        paddingLeft: 0,
        paddingRight: 0,
      }}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        <HorizontalSpace height={40} />

        <Col style={{paddingHorizontal: 16, marginBottom: 80}}>
          {/* menu accordion */}
          <Accordion
            activeSections={menuAcActive}
            sections={accordionContent}
            touchableComponent={TouchableOpacity}
            renderHeader={(section, _, isActive) =>
              isActive ? section.activeHeader : section.inactiveHeader
            }
            renderContent={section => section.content}
            renderFooter={() => <HorizontalSpace height={20} />}
            onChange={updateSections}
          />

          {/* 끼니추가 버튼 */}
          <AddMenuBtn onPress={() => onAddCreatePressed()}>
            <AddMenuBtnBar isActive={dTData?.length === 0} />
            <AddMenuBtnText>끼니 추가</AddMenuBtnText>
          </AddMenuBtn>

          {/* 여러끼니 자동구성 버튼 */}
          <HorizontalSpace height={24} />
          {dTData && dTData.length > 1 && (
            <CtaButton
              ref={autoMenuBtnRef}
              btnStyle="active"
              style={{
                width: SCREENWIDTH - 32,
                alignSelf: 'center',
                height: 48,
              }}
              btnText={`${dTData.length} 끼니 자동구성`}
              onPress={() =>
                navigate('AutoMenu', {
                  isOneMenuAuto: false,
                  selectedOneDietNo: undefined,
                  initialMenu: [],
                })
              }
            />
          )}
        </Col>
        {/* 끼니 정보 요약 */}
        <CartSummary
          setMenuNumSelectShow={setMenuNumSelectShow}
          setDietNoToNumControl={setDietNoToNumControl}
        />
      </ScrollView>

      {/* 주문 버튼 */}
      <CtaButton
        btnStyle={priceTotal === 0 ? 'inactive' : 'activeDark'}
        style={{
          width: SCREENWIDTH - 32,
          alignSelf: 'center',
          position: 'absolute',
          bottom: 8,
        }}
        btnText={`주문하기 (${commaToNum(priceTotal + shippingPrice)}원)`}
        onPress={() => {
          !!dTData && dispatch(setFoodToOrder(dTData));
          navigate('Order');
        }}
      />

      {/* 끼니 추가 알럿 */}
      <DAlert
        style={{width: 280}}
        alertShow={createAlertShow}
        onCancel={() => setCreateAlertShow(false)}
        onConfirm={async () => await onCreateDiet()}
        confirmLabel={isCreating ? '확인' : '추가'}
        NoOfBtn={isCreating ? 0 : 2}
        renderContent={() => (
          <CreateDietAlert
            numOfCreateDiet={numOfCreateDiet}
            setNumOfCreateDiet={setNumOfCreateDiet}
            isCreating={isCreating}
          />
        )}
      />
      {/* 끼니 추가 불가능 알럿 */}
      <DAlert
        alertShow={createNAAlertShow}
        onCancel={() => setCreateNAAlertShow(false)}
        onConfirm={() => setCreateNAAlertShow(false)}
        NoOfBtn={1}
        renderContent={() => <CommonAlertContent text={addDietNAText} />}
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

      {/* 자동구성 로딩 알럿 */}
      <DAlert
        alertShow={autoMenuStatus.isLoading}
        onCancel={() => {}}
        onConfirm={() => {}}
        NoOfBtn={0}
        renderContent={() => <LoadingAlertContent />}
      />
      {/* 자동구성 에러 알럿 */}
      <DAlert
        alertShow={autoMenuStatus.isError}
        onCancel={() => {}}
        onConfirm={() => {}}
        NoOfBtn={0}
        renderContent={() => <ErrorAlertContent />}
      />

      {/* 튜토리얼 (끼니 추가) */}
      <DTPScreen
        contentDelay={500}
        style={{paddingHorizontal: 16}}
        visible={isTutorialMode && tutorialProgress === 'AddMenu'}
        renderContent={() => (
          <>
            <DTooltip
              tooltipShow={true}
              text="끼니를 먼저 추가해볼까요?"
              boxTop={headerHeight + 4}
            />
            <AddMenuBtn
              onPress={() => onAddCreatePressed()}
              style={{marginTop: headerHeight + 40 + 4}}>
              <AddMenuBtnBar isActive={dTData?.length === 0} />
              <AddMenuBtnText>끼니 추가</AddMenuBtnText>
            </AddMenuBtn>
          </>
        )}
      />
      {/* 튜토리얼 (식품 추가) */}
      <DTPScreen
        style={{paddingHorizontal: 16}}
        visible={isTutorialMode && tutorialProgress === 'AddFood'}
        contentDelay={800}
        renderContent={() => (
          <>
            <DTooltip
              tooltipShow={true}
              text="식품을 추가할 차례에요!"
              boxTop={headerHeight + 40 + 48 + 8 + 70}
              boxLeft={8}
            />
            <AccordionCtaBtns
              style={{
                paddingHorizontal: 8,
                marginTop: headerHeight + 40 + 48 + 8 + 70 + 40,
              }}
              dDData={dTData ? dTData[0] : []}
              dietNo={currentDietNo}
              onlyAdd={true}
            />
          </>
        )}
      />
      {/* 튜토리얼 (남은영양 자동구성) */}
      <DTPScreen
        contentDelay={500}
        style={{paddingHorizontal: 16}}
        visible={isTutorialMode && tutorialProgress === 'AutoRemain'}
        renderContent={() => (
          <>
            <Col
              style={{
                position: 'absolute',
                width: '100%',
                backgroundColor: colors.white,
                paddingHorizontal: 8,
                marginTop: headerHeight + 40 + 48 + 8,
              }}>
              <NutrientsProgress dietDetailData={dTData ? dTData[0] : []} />
            </Col>
            <DTooltip
              tooltipShow={true}
              text="남은 영양을 자동으로 채워볼게요!"
              boxTop={headerHeight + 40 + 48 + 8 + 70 + 24 + 32 + 24 + 104 + 1}
              boxLeft={8 + 48 + 8}
            />
            <AccordionCtaBtns
              style={{
                paddingHorizontal: 8,
                marginTop:
                  headerHeight + 40 + 48 + 8 + 70 + 24 + 32 + 24 + 104 + 41,
              }}
              dDData={dTData ? dTData[0] : []}
              dietNo={currentDietNo}
              onlyAuto={true}
            />
          </>
        )}
      />
      {/* 튜토리얼 (남은영양 자동구성) */}
      <DTPScreen
        contentDelay={500}
        style={{paddingHorizontal: 16}}
        visible={isTutorialMode && tutorialProgress === 'ChangeFood'}
        renderContent={() => (
          <>
            <DTooltip
              tooltipShow={true}
              triangleRight={16}
              text="영양이 비슷한 식품으로 교체할 수 있어요"
              boxTop={
                headerHeight +
                40 +
                48 +
                8 +
                70 +
                24 +
                32 +
                24 +
                104 +
                24 +
                104 -
                52 -
                40
              }
              boxRight={8}
            />
            <ChangeBtn
              onPress={() => {
                navigate('Change', {
                  dietNo: currentDietNo,
                  productNo: dTData[0][1].productNo,
                  food: dTData[0][1],
                });
              }}
              style={{
                position: 'absolute',
                top:
                  headerHeight +
                  40 +
                  48 +
                  8 +
                  70 +
                  24 +
                  32 +
                  24 +
                  104 +
                  24 +
                  104 -
                  52,
                right: 8,
              }}>
              <Icon source={icons.changeRound_24} />
            </ChangeBtn>
          </>
        )}
      />
      <DTPScreen
        contentDelay={2000}
        style={{paddingHorizontal: 16}}
        visible={isTutorialMode && tutorialProgress === 'AutoMenu'}
        renderContent={() => (
          <>
            <DTooltip
              tooltipShow={true}
              text="전체 자동구성도 해볼게요"
              boxBottom={bottomTabBarHeight + 8 + 52 + 24 + 48 + 4}
              boxLeft={0}
            />
            <CtaButton
              shadow={false}
              btnStyle="active"
              style={{
                position: 'absolute',
                width: SCREENWIDTH - 32,
                height: 48,
                bottom: bottomTabBarHeight + 8 + 52 + 24,
                alignSelf: 'center',
              }}
              btnText={`${dTData?.length} 끼니 자동구성`}
              onPress={() =>
                navigate('AutoMenu', {
                  isOneMenuAuto: false,
                  selectedOneDietNo: undefined,
                  initialMenu: [],
                })
              }
            />
          </>
        )}
      />
      {/* 튜토리얼 완료 */}
      <DAlert
        contentDelay={1000}
        alertShow={isTutorialMode && tutorialProgress === 'Complete'}
        onCancel={() => {}}
        onConfirm={() => {
          dispatch(setTutorialEnd());
          updateNotShowAgainList({key: 'tutorial', value: true});
        }}
        NoOfBtn={1}
        renderContent={() => (
          <CommonAlertContent
            text={'튜토리얼이 완료되었어요\n이제 자유롭게 이용해보세요!'}
            subText={'튜토리얼은 마이페이지에서\n다시 진행할 수 있어요'}
          />
        )}
      />
    </Container>
  );
};

export default Diet;

const AddMenuBtn = styled.TouchableOpacity`
  width: 100%;
  height: 48px;
  background-color: ${colors.white};
  border-radius: 5px;

  justify-content: center;
  align-items: center;

  margin-top: 4px;
`;

const AddMenuBtnText = styled(TextMain)`
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
`;
const AddMenuBtnBar = styled.View<{isActive: boolean}>`
  width: 4px;
  height: 48px;
  position: absolute;
  left: 0px;
  background-color: ${({isActive}) =>
    isActive ? colors.main : colors.inactivated};

  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const ChangeBtn = styled.TouchableOpacity`
  width: 32px;
  height: 52px;
  background-color: ${colors.white};
  justify-content: center;
  align-items: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  border-width: 1px;
  border-color: ${colors.lineLight};
`;

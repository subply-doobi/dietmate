// RN
import {useEffect, useMemo, useRef, useState} from 'react';

// 3rd
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused, useNavigation} from '@react-navigation/native';
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
  setAutoMenuStatus,
  setCurrentDiet,
  setIsTutorialMode,
  setMenuAcActive,
  setTutorialEnd,
  setTutorialProgress,
  setTutorialStart,
} from '../../features/reduxSlices/commonSlice';
import {ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import CtaButton from '../../shared/ui/CtaButton';
import {
  IS_ANDROID,
  IS_IOS,
  SCREENHEIGHT,
  SCREENWIDTH,
} from '../../shared/constants';
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
import {updateNotShowAgainList} from '../../shared/utils/asyncStorage';
import DTPScreen from '../../shared/ui/DTPScreen';
import CartSummary from '../../components/cart/CartSummary';
import AddMenuBtn from './ui/AddMenuBtn';
import {renderAlertContent, renderDTPContent} from './util/modalContent';

const Diet = () => {
  // navigation
  const {navigate} = useNavigation();
  const isFocused = useIsFocused();
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
  const [forceModalQuit, setForceModalQuit] = useState(false);
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
    dispatch(setTutorialProgress(''));
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
              y: IS_ANDROID
                ? py -
                  (SCREENHEIGHT -
                    (height + headerHeight + bottomTabBarHeight + 40 + 60))
                : IS_IOS
                  ? py -
                    (SCREENHEIGHT - (height + bottomTabBarHeight + 40 + 44))
                  : 0,
              animated: true,
            });
          }),
        1500,
      );
      return;
    }
  }, [tutorialProgress]);

  useEffect(() => {
    if (!isFocused) {
      setForceModalQuit(true);
      return;
    }
    setForceModalQuit(false);
  }, [isFocused]);

  // ███    ███  ██████  ██████   █████  ██
  // ████  ████ ██    ██ ██   ██ ██   ██ ██
  // ██ ████ ██ ██    ██ ██   ██ ███████ ██
  // ██  ██  ██ ██    ██ ██   ██ ██   ██ ██
  // ██      ██  ██████  ██████  ██   ██ ███████

  // alert state
  const alertState = createAlertShow
    ? 'createDiet'
    : createNAAlertShow
      ? 'createDietNA'
      : autoMenuStatus.isLoading
        ? 'autoMenuLoading'
        : autoMenuStatus.isError
          ? 'autoMenuError'
          : isTutorialMode && tutorialProgress === 'Complete'
            ? 'tutorialComplete'
            : '';
  const alertShow = !forceModalQuit && alertState !== '';
  // alert confirm fn
  const alertConfirmFn: {[key: string]: Function} = {
    createDiet: async () => await onCreateDiet(),
    createDietNA: () => setCreateNAAlertShow(false),
    autoMenuLoading: () => {},
    autoMenuError: () => dispatch(setAutoMenuStatus({isError: false})),
    tutorialComplete: () => {
      dispatch(setTutorialEnd());
      updateNotShowAgainList({key: 'tutorial', value: true});
    },
  };
  // alert cancel fn
  const alertCancelFn: {[key: string]: Function} = {
    createDiet: () => setCreateAlertShow(false),
    createDietNA: () => setCreateNAAlertShow(false),
    autoMenuLoading: () => {},
    autoMenuError: () => dispatch(setAutoMenuStatus({isError: false})),
    tutorialComplete: () => {},
  };
  const alertNumOfBtn: {[key: string]: 0 | 1 | 2} = {
    createDiet: isCreating
      ? 0
      : isTutorialMode && tutorialProgress === 'AddMenu'
        ? 1
        : 2,
    createDietNA: 1,
    autoMenuLoading: 0,
    autoMenuError: 1,
    tutorialComplete: 1,
  };
  const alertDelay = alertState === 'tutorialComplete' ? 1000 : 0;
  const alertConfirmLabel = alertState === 'createDiet' ? '추가' : '확인';

  // DTP state
  const dTPShow =
    !forceModalQuit &&
    !alertShow &&
    isTutorialMode &&
    (tutorialProgress === 'AddMenu' ||
      tutorialProgress === 'AddFood' ||
      tutorialProgress === 'AutoRemain' ||
      tutorialProgress === 'ChangeFood' ||
      tutorialProgress === 'AutoMenu');

  const dtpDeley: {[key: string]: number} = {
    AddMenu: 500,
    AddFood: 800,
    AutoRemain: 500,
    ChangeFood: 500,
    AutoMenu: 2000,
  };
  const dtpAction: {[key: string]: () => void} = {
    AddMenu: () => {
      onAddCreatePressed();
    },
    AddFood: () => setForceModalQuit(true),
    AutoRemain: () => {},
    ChangeFood: () => {
      navigate('Change', {
        dietNo: currentDietNo,
        productNo: dTData[0][1].productNo,
        food: dTData[0][1],
      });
    },
    AutoMenu: () => {
      navigate('AutoMenu', {
        isOneMenuAuto: false,
        selectedOneDietNo: undefined,
        initialMenu: [],
      });
    },
  };

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
          {dTData && <AddMenuBtn onPress={onCreateDiet} dTData={dTData} />}

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

      {/* 알럿 */}
      <DAlert
        contentDelay={alertDelay}
        style={{width: 280}}
        alertShow={alertShow}
        onCancel={alertCancelFn[alertState]}
        onConfirm={alertConfirmFn[alertState]}
        confirmLabel={alertConfirmLabel}
        NoOfBtn={alertNumOfBtn[alertState]}
        renderContent={() =>
          renderAlertContent[alertState] &&
          renderAlertContent[alertState]({
            numOfCreateDiet,
            setNumOfCreateDiet,
            isCreating,
            addDietNAText,
          })
        }
      />

      {/* DTP (튜토리얼)*/}
      <DTPScreen
        contentDelay={dtpDeley[tutorialProgress] || 0}
        style={{paddingHorizontal: 16}}
        visible={dTPShow}
        renderContent={() =>
          renderDTPContent[tutorialProgress] &&
          renderDTPContent[tutorialProgress]({
            fn: dtpAction[tutorialProgress],
            headerHeight,
            bottomTabBarHeight,
            dTData: dTData || [],
            currentDietNo,
          })
        }
      />
    </Container>
  );
};

export default Diet;

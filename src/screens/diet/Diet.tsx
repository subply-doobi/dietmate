// RN
import {useEffect, useMemo, useRef, useState} from 'react';

// 3rd
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
  useCreateDietCnt,
  useListDietTotalObj,
} from '../../shared/api/queries/diet';

import {getMenuAcContent} from '../../shared/utils/menuAccordion';
import {Col, Container, HorizontalSpace} from '../../shared/ui/styledComps';
import {
  setAutoMenuStatus,
  setCurrentDiet,
  setMenuAcActive,
  setTutorialEnd,
  setTutorialProgress,
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
import DBottomSheet from '../../components/common/bottomsheet/DBottomSheet';
import MenuNumSelectContent from '../../components/cart/MenuNumSelectContent';
import DAlert from '../../shared/ui/DAlert';
import {getAddDietStatusFrDTData} from '../../shared/utils/getDietAddStatus';
import {commaToNum, sumUpDietFromDTOData} from '../../shared/utils/sumUp';
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
  const {
    data: dTOData,
    isLoading: isDTObjLoading,
    refetch: refetchDTOData,
  } = useListDietTotalObj();
  const createDietCntMutation = useCreateDietCnt();

  if (dTOData) {
    console.log(
      'Diet: dTOData test:',
      dTOData[Object.keys(dTOData)[0]].dietDetail[0],
    );
  }
  // useState
  const [dTPShow, setDTPShow] = useState(false);
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
  const {menuNum, accordionContent, totalShippingPrice, priceTotal} =
    useMemo(() => {
      // 비어있는 끼니 확인
      const {menuNum, priceTotal, totalShippingPrice} =
        sumUpDietFromDTOData(dTOData);

      // accordion
      const accordionContent = getMenuAcContent({
        bLData: bLData,
        dTOData,
        setMenuNumSelectShow,
        setDietNoToNumControl,
      });

      return {
        menuNum,
        accordionContent,
        totalShippingPrice,
        priceTotal,
      };
    }, [dTOData]);

  // etc
  const {status: addDietStatus, text: addDietNAText} =
    getAddDietStatusFrDTData(dTOData);

  // fn
  const updateSections = (activeSections: number[]) => {
    dispatch(setMenuAcActive(activeSections));
    if (!dTOData || activeSections.length === 0) return;
    const currentIdx = activeSections[0];
    const currentDietNo = Object.keys(dTOData)[currentIdx];
    currentDietNo && dispatch(setCurrentDiet(currentDietNo));
  };

  const onAddCreatePressed = () => {
    if (!dTOData) return;
    // dispatch(setTutorialProgress(''));
    setIsCreating(false);
    if (addDietStatus === 'possible') {
      menuNum < 5 ? setNumOfCreateDiet(5 - menuNum) : setNumOfCreateDiet(1);
      setCreateAlertShow(true);
      return;
    }
    setCreateNAAlertShow(true);
  };

  const onCreateDiet = async () => {
    setIsCreating(true);

    await createDietCntMutation.mutateAsync({
      dietCnt: String(numOfCreateDiet),
    });

    isTutorialMode && dispatch(setTutorialProgress('AddFood'));

    setIsCreating(false);
    setCreateAlertShow(false);

    const refetchedDTOData = (await refetchDTOData()).data;
    const firstAddedDietNo = refetchedDTOData
      ? Object.keys(refetchedDTOData)[0]
      : '';
    dispatch(setCurrentDiet(firstAddedDietNo));

    isTutorialMode &&
      setTimeout(() => {
        dispatch(setMenuAcActive([0]));
      }, 200);
  };

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
  useEffect(() => {
    if (
      !forceModalQuit &&
      !alertShow &&
      isTutorialMode &&
      (tutorialProgress === 'AddMenu' ||
        tutorialProgress === 'AddFood' ||
        tutorialProgress === 'AutoRemain' ||
        tutorialProgress === 'ChangeFood' ||
        tutorialProgress === 'AutoMenu')
    ) {
      setTimeout(() => {
        setDTPShow(true);
      }, 100);
      return;
    }
    setDTPShow(false);
  }, [tutorialProgress, alertShow, forceModalQuit]);

  const dtpDeley: {[key: string]: number} = {
    AddMenu: 500,
    AddFood: 1000,
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
        productNo: dTOData?.[currentDietNo]?.dietDetail[1]?.productNo ?? '',
        food: dTOData?.[currentDietNo]?.dietDetail[1] ?? undefined,
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
  if (isDTObjLoading || isCreating) {
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
          {/* 끼니 아코디언 */}
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
          {dTOData && (
            <AddMenuBtn onPress={onAddCreatePressed} dTOData={dTOData} />
          )}

          {/* 여러끼니 자동구성 버튼 */}
          <HorizontalSpace height={24} />
          {dTOData && menuNum > 1 && (
            <CtaButton
              ref={autoMenuBtnRef}
              btnStyle="active"
              style={{
                width: SCREENWIDTH - 32,
                alignSelf: 'center',
                height: 48,
              }}
              btnText={`전체 자동구성`}
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
        btnText={`주문하기 (${commaToNum(priceTotal + totalShippingPrice)}원)`}
        onPress={() => {
          !!dTOData && dispatch(setFoodToOrder(dTOData));
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
            dTOData: dTOData || {},
            currentDietNo,
          })
        }
      />
    </Container>
  );
};

export default Diet;

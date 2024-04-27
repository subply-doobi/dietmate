// RN
import {useEffect, useMemo, useState} from 'react';

// 3rd
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';

// doobi
import colors from '../../shared/colors';
import {RootState} from '../../app/store/reduxStore';
import {useGetBaseLine} from '../../shared/api/queries/baseLine';
import {
  useCreateDiet,
  useGetDietDetailEmptyYn,
  useListDiet,
  useListDietTotal,
} from '../../shared/api/queries/diet';

import {findEmptyDietSeq} from '../../shared/utils/findDietSeq';
import {getMenuAcContent} from '../../shared/utils/menuAccordion';
import {
  Container,
  HorizontalSpace,
  TextMain,
} from '../../shared/ui/styledComps';
import {
  setCurrentDiet,
  setMenuAcActive,
} from '../../features/reduxSlices/commonSlice';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import {ActivityIndicator, ScrollView, TouchableOpacity} from 'react-native';
import CtaButton from '../../shared/ui/CtaButton';
import {SCREENWIDTH} from '../../shared/constants';
import {setFoodToOrder} from '../../features/reduxSlices/orderSlice';
import {convertQsResultToData} from '../../shared/utils/queriesData';
import Accordion from 'react-native-collapsible/Accordion';
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

const Diet = () => {
  // navigation
  const {navigate} = useNavigation();

  // redux
  const dispatch = useDispatch();
  const {currentDietNo} = useSelector((state: RootState) => state.common);
  const {menuAcActive} = useSelector((state: RootState) => state.common);

  // react-query
  const {data: baseLineData} = useGetBaseLine();
  const {data: dietData, isLoading: islistDietLoading} = useListDiet();
  const dietTotalData =
    !!dietData && useListDietTotal(dietData, {enabled: !!dietData});
  const createDietMutation = useCreateDiet();

  // useState
  const [createAlertShow, setCreateAlertShow] = useState(false);
  const [numOfCreateDiet, setNumOfCreateDiet] = useState(5);
  const [isCreating, setIsCreating] = useState(false);
  const [createNAAlertShow, setCreateNAAlertShow] = useState(false);
  const [menuNumSelectShow, setMenuNumSelectShow] = useState(false);
  const [dietNoToNumControl, setDietNoToNumControl] = useState<string>('');

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
      bLData: baseLineData,
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
    let firstAddedDietNo = '';
    for (let i = 0; i < numOfCreateDiet; i++) {
      const res = await createDietMutation.mutateAsync();
      if (i === 0) firstAddedDietNo = res.dietNo;
    }
    dispatch(setCurrentDiet(firstAddedDietNo));
    setCreateAlertShow(false);
  };

  // render
  if (dTDataStatus === 'isLoading' || !dTData || islistDietLoading) {
    return (
      <Container style={{justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={24} color={colors.main} />
      </Container>
    );
  }

  return (
    <Container style={{backgroundColor: colors.backgroundLight2}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 80}}>
        <HorizontalSpace height={40} />
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
          <AddMenuBtnBar />
          <AddMenuBtnText>끼니 추가</AddMenuBtnText>
        </AddMenuBtn>

        {/* 여러끼니 자동구성 버튼 */}
        <HorizontalSpace height={24} />
        {dTData && dTData.length > 1 && (
          <CtaButton
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
const AddMenuBtnBar = styled.View`
  width: 4px;
  height: 48px;
  position: absolute;
  left: 0px;
  background-color: ${colors.inactivated};

  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

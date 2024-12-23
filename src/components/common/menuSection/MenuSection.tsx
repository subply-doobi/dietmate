// react, RN, 3rd
import {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';
import Accordion from 'react-native-collapsible/Accordion';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../app/store/reduxStore';

// doobi util, constant etc
import {icons} from '../../../shared/iconSource';
import colors from '../../../shared/colors';
import {SCREENHEIGHT} from '../../../shared/constants';
import {
  HorizontalSpace,
  Icon,
  Row,
  TextMain,
} from '../../../shared/ui/styledComps';

// doobi Components
import DAlert from '../../../shared/ui/DAlert';
import MenuSelectCard from './MenuSelectCard';
import DeleteAlertContent from '../alert/DeleteAlertContent';
import NutrientsProgress from '../nutrient/NutrientsProgress';
import DBottomSheet from '../bottomsheet/DBottomSheet';
import MenuNumSelectContent from '../../cart/MenuNumSelectContent';
import Menu from '../../menuAccordion/Menu';

// react-query
import {
  useCreateDiet,
  useDeleteDiet,
  useListDietTotalObj,
} from '../../../shared/api/queries/diet';
import MenuNumSelect from '../../cart/MenuNumSelect';
import {commaToNum, sumUpPrice} from '../../../shared/utils/sumUp';
import {useGetBaseLine} from '../../../shared/api/queries/baseLine';
import {openModal, closeModal} from '../../../features/reduxSlices/modalSlice';

const MenuSection = () => {
  // redux
  const dispatch = useDispatch();
  const menuDeleteAlert = useSelector(
    (state: RootState) => state.modal.modal.menuDeleteAlert,
  );
  const {currentDietNo} = useSelector((state: RootState) => state.common);
  const menuNumSelectBS = useSelector(
    (state: RootState) => state.modal.modal.menuNumSelectBS,
  );

  // react-query
  const {data: baseLineData, isLoading: getBLIsLoading} = useGetBaseLine();
  const createDietMutation = useCreateDiet();
  const deleteDietMutation = useDeleteDiet();
  const {
    data: dTOData,
    isLoading: isDTOLoading,
    isFetching: isDTOFetching,
  } = useListDietTotalObj();
  const dietDetailData = dTOData?.[currentDietNo]?.dietDetail ?? [];
  // state
  const [dietNoToDelete, setDietNoToDelete] = useState<string>();
  const [activeSection, setActiveSection] = useState<number[]>([]); // accordion
  const [isCreating, setIsCreating] = useState(false);

  // etc
  const isAccordionActive = activeSection.length > 0;
  const priceSum = sumUpPrice(dietDetailData);
  const currentQty =
    dietDetailData && dietDetailData.length > 0
      ? parseInt(dietDetailData[0].qty)
      : 0;
  const hasNoDiet =
    !dTOData || Object.keys(dTOData).length === 0 ? true : false;
  const onDeleteDiet = () => {
    if (!dTOData) return;
    dietNoToDelete &&
      deleteDietMutation.mutate({dietNo: dietNoToDelete, currentDietNo});
    dispatch(closeModal({name: 'menuDeleteAlert'}));
  };

  const onMenuNoSelectPress = () => {
    dispatch(
      openModal({
        name: 'menuNumSelectBS',
        modalId: 'MenuSection',
        values: {dietNo: currentDietNo},
      }),
    );
  };

  // accordion
  // accordionUpdate
  const updateSections = (activeSections: number[]) => {
    setActiveSection(activeSections);
  };

  // useEffect
  // diet생성이나 diet전환할 때 dietNo바뀐경우 activeSection 초기화
  useEffect(() => {
    setActiveSection([]);
  }, [currentDietNo]);

  // accordionContent
  const PROGRESS_ACCORDION = useMemo(() => {
    // 로딩 중
    if (
      getBLIsLoading ||
      isDTOLoading ||
      (baseLineData && Object.keys(baseLineData).length === 0)
    )
      return [
        {
          inactiveHeader: (
            <IndicatorBox>
              <ActivityIndicator size="small" color={colors.main} />
            </IndicatorBox>
          ),
          content: <></>,
          activeHeader: (
            <IndicatorBox>
              <ActivityIndicator size="small" color={colors.main} />
            </IndicatorBox>
          ),
        },
      ];

    // 끼니 없는 경우
    if (hasNoDiet)
      return [
        {
          inactiveHeader: (
            <IndicatorBox
              disabled={isCreating || isDTOFetching}
              onPress={async () => {
                setIsCreating(true);
                await createDietMutation.mutateAsync({
                  setDietNo: true,
                });
                setIsCreating(false);
              }}>
              {isCreating || isDTOFetching ? (
                <ActivityIndicator size="small" color={colors.main} />
              ) : (
                <Row>
                  <Icon source={icons.warning_24} size={20} />
                  <AddMenuText>+ 버튼을 눌러 끼니를 추가해보세요</AddMenuText>
                </Row>
              )}
            </IndicatorBox>
          ),
          content: <></>,
          activeHeader: <></>,
        },
      ];

    // 끼니 있는 경우
    return [
      {
        // progressBar
        inactiveHeader: (
          <ProgressContainer>
            {/* 끼니 수량조절 */}
            {isAccordionActive && (
              <>
                <Row
                  style={{
                    marginTop: 24,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <PriceSum>{commaToNum(priceSum)}원</PriceSum>
                  <MenuNumSelect
                    disabled={!!dietDetailData && dietDetailData.length === 0}
                    action="openModal"
                    currentQty={currentQty}
                    openMenuNumSelect={onMenuNoSelectPress}
                  />
                </Row>
                <HorizontalSpace height={8} />
              </>
            )}

            {dietDetailData && (
              <NutrientsProgress dietDetailData={dietDetailData} />
            )}
            {!isAccordionActive && <Arrow source={icons.arrowDown_20} />}
          </ProgressContainer>
        ),
        content: (
          // 툴팁잘림 => activeHeader paddingBottom에 + , content marginTop에 - 로 조절
          <ProgressContainer style={{marginTop: -24}}>
            {dietDetailData?.length === 0 ? (
              <>
                <HorizontalSpace height={8} />
                <Menu dietNo={currentDietNo} dietDetailData={dietDetailData} />
              </>
            ) : (
              <ScrollView
                style={{height: SCREENHEIGHT - 410}}
                showsVerticalScrollIndicator={false}>
                <HorizontalSpace height={8} />
                <Menu
                  dietNo={currentDietNo}
                  dietDetailData={dietDetailData || []}
                />
              </ScrollView>
            )}

            <MenuContainerClose onPress={() => setActiveSection([])}>
              {isAccordionActive && <Arrow source={icons.arrowUp_20} />}
            </MenuContainerClose>
          </ProgressContainer>
        ),
        activeHeader: (
          // 툴팁잘림 => activeHeader paddingBottom에 + , content marginTop에 - 로 조절
          <ProgressContainer style={{paddingBottom: 24}}>
            {/* 끼니 수량조절 */}
            <>
              <Row
                style={{
                  marginTop: 24,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <PriceSum>{commaToNum(priceSum)}원</PriceSum>
                <MenuNumSelect
                  disabled={!!dietDetailData && dietDetailData.length === 0}
                  action="openModal"
                  currentQty={currentQty}
                  openMenuNumSelect={onMenuNoSelectPress}
                />
              </Row>
              <HorizontalSpace height={8} />
            </>

            <NutrientsProgress dietDetailData={dietDetailData || []} />
            {!isAccordionActive && <Arrow source={icons.arrowDown_20} />}
          </ProgressContainer>
        ),
      },
    ];
  }, [dTOData, baseLineData, activeSection, isCreating]);

  // render
  return (
    <Container>
      {/* 끼니 선택 책갈피 */}
      <HeaderRow>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <MenuSelectCard
            isCreating={isCreating}
            setIsCreating={setIsCreating}
          />
        </ScrollView>
        {!hasNoDiet && (
          <DeleteBtn
            onPress={() => {
              setDietNoToDelete(currentDietNo);
              dispatch(
                openModal({name: 'menuDeleteAlert', modalId: 'MenuSection'}),
              );
            }}>
            <DeleteImg source={icons.deleteRound_18} />
          </DeleteBtn>
        )}
      </HeaderRow>

      {/* 끼니 삭제 알럿 */}
      <DAlert
        NoOfBtn={2}
        alertShow={
          menuDeleteAlert.isOpen && menuDeleteAlert.modalId === 'MenuSection'
        }
        renderContent={() => (
          <DeleteAlertContent
            deleteText={dTOData?.[currentDietNo]?.dietSeq ?? ''}
          />
        )}
        onConfirm={() => onDeleteDiet()}
        onCancel={() => dispatch(closeModal({name: 'menuDeleteAlert'}))}
      />

      <Accordion
        activeSections={activeSection}
        sections={PROGRESS_ACCORDION}
        touchableComponent={TouchableWithoutFeedback}
        renderHeader={(section, _, isActive) =>
          isActive ? section.activeHeader : section.inactiveHeader
        }
        renderContent={section => section.content}
        onChange={updateSections}
      />

      {/* 끼니 수량 조절용 BottomSheet */}
      <DBottomSheet
        visible={
          menuNumSelectBS.isOpen && menuNumSelectBS.modalId === 'MenuSection'
        }
        closeModal={() => dispatch(closeModal({name: 'menuNumSelectBS'}))}
        renderContent={() => <MenuNumSelectContent />}
        onCancel={() => dispatch(closeModal({name: 'menuNumSelectBS'}))}
      />
    </Container>
  );
};

export default MenuSection;

const AddMenuText = styled(TextMain)`
  font-size: 16px;
  margin-left: 4px;
`;

const IndicatorBox = styled.TouchableOpacity`
  width: 100%;
  height: 70px;
  background-color: ${colors.white};

  justify-content: center;
  align-items: center;
`;

const Container = styled.View`
  background-color: ${colors.backgroundLight2};
  padding: 0px 0px 16px 0px;
  width: 100%;
  z-index: 1000;
`;

const HeaderRow = styled(Row)`
  justify-content: space-between;
  align-items: flex-end;
`;

const DeleteBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const DeleteImg = styled.Image`
  width: 18px;
  height: 18px;
`;

const ProgressContainer = styled.View`
  padding: 0px 16px 0px 16px;
  background-color: ${colors.white};
`;

const Arrow = styled.Image`
  width: 20px;
  height: 20px;
  align-self: center;
  z-index: -1;
`;

const PriceSum = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
`;

const MenuContainer = styled.View`
  background-color: ${colors.white};
  padding: 0px 8px 0px 8px;
`;

const MenuContainerClose = styled.TouchableOpacity`
  height: 32px;
  width: 100%;
  align-self: center;

  justify-content: center;
  align-items: center;

  margin-top: 16px;
`;

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
import {useNavigation} from '@react-navigation/native';

// doobi util, constant etc
import {icons} from '../../../shared/iconSource';
import {findDietSeq} from '../../../shared/utils/findDietSeq';
import colors from '../../../shared/colors';
import {SCREENHEIGHT, SCREENWIDTH} from '../../../shared/constants';
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
  useDeleteDiet,
  useListDiet,
  useListDietDetail,
} from '../../../shared/api/queries/diet';
import MenuNumSelect from '../../cart/MenuNumSelect';
import {commaToNum, sumUpPrice} from '../../../shared/utils/sumUp';
import {useGetBaseLine} from '../../../shared/api/queries/baseLine';

const MenuSection = () => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.common);

  // react-query
  const {data: baseLineData, isLoading: getBLIsLoading} = useGetBaseLine();
  const {data: dietData, isLoading: listDietIsLoading} = useListDiet();
  const deleteDietMutation = useDeleteDiet();
  const {data: dietDetailData, isLoading: listDDIsLoading} = useListDietDetail(
    currentDietNo,
    {
      enabled: currentDietNo ? true : false,
    },
  );

  // state
  const [dietNoToDelete, setDietNoToDelete] = useState<string>();
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);
  const [activeSection, setActiveSection] = useState<number[]>([]); // accordion
  const [menuNumSelectShow, setMenuNumSelectShow] = useState(false);
  const [dietNoToNumControl, setDietNoToNumControl] = useState<string>('');

  // etc
  const isAccordionActive = activeSection.length > 0;
  const onDeleteDiet = () => {
    if (!dietData) return;
    dietNoToDelete && deleteDietMutation.mutate({dietNo: dietNoToDelete});
    setDeleteAlertShow(false);
  };
  const priceSum = sumUpPrice(dietDetailData);
  const currentQty =
    dietDetailData && dietDetailData.length > 0
      ? parseInt(dietDetailData[0].qty)
      : 0;

  const onMenuNoSelectPress = () => {
    setDietNoToNumControl(currentDietNo);
    setMenuNumSelectShow(true);
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
      listDietIsLoading ||
      listDDIsLoading ||
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
    if (dietData && dietData.length === 0)
      return [
        {
          inactiveHeader: (
            <IndicatorBox>
              <Row>
                <Icon source={icons.warning_24} size={20} />
                <AddMenuText>+ 버튼을 눌러 끼니를 추가해보세요</AddMenuText>
              </Row>
            </IndicatorBox>
          ),
          content: <></>,
          activeHeader: (
            <IndicatorBox>
              <Row>
                <Icon source={icons.warning_24} size={20} />
                <AddMenuText>+ 버튼을 눌러 끼니를 추가해보세요</AddMenuText>
              </Row>
            </IndicatorBox>
          ),
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
                <Menu dietNo={currentDietNo} dietDetailData={dietDetailData} />
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

            <NutrientsProgress dietDetailData={dietDetailData} />
            {!isAccordionActive && <Arrow source={icons.arrowDown_20} />}
          </ProgressContainer>
        ),
      },
    ];
  }, [dietDetailData, dietData, baseLineData, activeSection]);

  return (
    <Container>
      {/* 끼니 선택 책갈피 */}
      <HeaderRow>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <MenuSelectCard />
        </ScrollView>
        {dietData && dietData.length > 0 && (
          <DeleteBtn
            onPress={() => {
              setDietNoToDelete(currentDietNo);
              setDeleteAlertShow(true);
            }}>
            <DeleteImg source={icons.deleteRound_18} />
          </DeleteBtn>
        )}
      </HeaderRow>

      {/* 끼니 삭제 알럿 */}
      <DAlert
        NoOfBtn={2}
        alertShow={deleteAlertShow}
        renderContent={() => (
          <DeleteAlertContent
            deleteText={
              dietData ? findDietSeq(dietData, dietNoToDelete).dietSeq : ''
            }
          />
        )}
        onConfirm={() => onDeleteDiet()}
        onCancel={() => setDeleteAlertShow(false)}
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

export default MenuSection;

const AddMenuText = styled(TextMain)`
  font-size: 16px;
  margin-left: 4px;
`;

const IndicatorBox = styled.View`
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

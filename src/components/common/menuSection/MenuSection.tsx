// react, RN, 3rd
import {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import styled from 'styled-components/native';
import Accordion from 'react-native-collapsible/Accordion';

// doobi util, redux, etc
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../stores/store';
import {icons} from '../../../assets/icons/iconSource';
import {HorizontalSpace, Row, TextMain} from '../../../styles/styledConsts';
import {findDietSeq} from '../../../util/findDietSeq';
import colors from '../../../styles/colors';

// doobi Components
import DAlert from '../alert/DAlert';
import MenuSelectCard from './MenuSelectCard';
import DeleteAlertContent from '../alert/DeleteAlertContent';
import NutrientsProgress from '../nutrient/NutrientsProgress';
import DBottomSheet from '../bottomsheet/DBottomSheet';
import MenuNumSelectContent from '../../cart/MenuNumSelectContent';
import Menu from '../../cart/Menu';

// react-query
import {
  useDeleteDiet,
  useListDiet,
  useListDietDetail,
} from '../../../query/queries/diet';
import MenuNumSelect from '../../cart/MenuNumSelect';
import {commaToNum, sumUpPrice} from '../../../util/sumUp';

const MenuSection = () => {
  // redux
  const dispatch = useDispatch();
  const {currentDietNo} = useSelector((state: RootState) => state.common);

  // react-query
  const {data: dietData} = useListDiet();
  const deleteDietMutation = useDeleteDiet();
  const {data: dietDetailData} = useListDietDetail(currentDietNo, {
    enabled: currentDietNo ? true : false,
  });

  // state
  const [dietNoToDelete, setDietNoToDelete] = useState<string>();
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);
  const [activeSection, setActiveSection] = useState<number[]>([]); // accordion
  const [menuNumSelectShow, setMenuNumSelectShow] = useState(false);
  const [dietNoToNumControl, setDietNoToNumControl] = useState<string>('');

  // etc
  const isAccordionActive = activeSection.length > 0;
  const onDeleteDiet = () => {
    if (!dietData || dietData.length === 1) return;
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

  // accordionContent
  const PROGRESS_ACCORDION = useMemo(() => {
    if (!dietData || !dietDetailData)
      return [
        {
          // TBD : loading시 inactiveHeader 자리에 indicator
          inactiveHeader: (
            <IndicatorBox>
              <ActivityIndicator size="small" color={colors.main} />
            </IndicatorBox>
          ),
          content: <></>,
          activeHeader: <></>,
        },
      ];

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
            <Menu dietNo={currentDietNo} dietDetailData={dietDetailData} />
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
  }, [dietDetailData, activeSection]);

  return (
    <Container>
      {/* 끼니 선택 책갈피 */}
      <HeaderRow>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <MenuSelectCard />
        </ScrollView>
        {dietData && dietData.length > 1 && (
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

// react, RN, 3rd
import {useState} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';

// doobi util, redux, etc
import {useSelector} from 'react-redux';
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
  const {currentDietNo} = useSelector((state: RootState) => state.cart);

  // react-query
  const {data: dietData} = useListDiet();
  const deleteDietMutation = useDeleteDiet();
  const {data: dietDetailData} = useListDietDetail(currentDietNo, {
    enabled: currentDietNo ? true : false,
  });

  // state
  const [dietNoToDelete, setDietNoToDelete] = useState<string>();
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);
  const [menuShow, setMenuShow] = useState(false);
  const [menuNumSelectShow, setMenuNumSelectShow] = useState(false);
  const [dietNoToNumControl, setDietNoToNumControl] = useState<string>('');

  // etc
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

      {/* progressBar !!!!!!!!!! */}
      <ProgressContainer onPress={() => setMenuShow(v => !v)}>
        {/* 끼니 수량조절 */}
        {menuShow && dietDetailData && (
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
                isForOpenModal={true}
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
        <Arrow source={menuShow ? icons.arrowUp_20 : icons.arrowDown_20} />
      </ProgressContainer>

      {/* menu */}
      {menuShow && dietDetailData && (
        <MenuContainer>
          <Menu
            dietNo={currentDietNo}
            dietDetailData={dietDetailData}
            setDietNoToNumControl={setDietNoToNumControl}
            setMenuNumSelectShow={setMenuNumSelectShow}
          />
        </MenuContainer>
      )}

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

const ProgressContainer = styled.Pressable`
  padding: 0px 16px 8px 16px;
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
  padding: 0px 8px 16px 8px;
`;

// react, RN, 3rd
import {useState} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';

// doobi util, redux, etc
import {useSelector} from 'react-redux';
import {RootState} from '../../../stores/store';
import {icons} from '../../../assets/icons/iconSource';
import {Row} from '../../../styles/StyledConsts';
import {findDietSeq} from '../../../util/findDietSeq';
import colors from '../../../styles/colors';

// doobi Components
import DAlert from '../alert/DAlert';
import MenuSelectCard from './MenuSelectCard';
import DeleteAlertContent from '../alert/DeleteAlertContent';
import NutrientsProgress from '../nutrient/NutrientsProgress';

// react-query
import {
  useDeleteDiet,
  useListDiet,
  useListDietDetail,
} from '../../../query/queries/diet';
import {scrollTo} from 'react-native-reanimated';
import CartFoodList from '../../cart/CartFoodList';
import DBottomSheet from '../DBottomSheet';
import NumberPickerContent from '../../cart/NumberPickerContent';
import Menu from './Menu';

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
  const [numberPickerShow, setNumberPickerShow] = useState(false);
  const [dietNoToNumControl, setDietNoToNumControl] = useState<string>('');

  // etc
  const onDeleteDiet = () => {
    if (!dietData || dietData.length === 1) return;
    dietNoToDelete && deleteDietMutation.mutate({dietNo: dietNoToDelete});
    setDeleteAlertShow(false);
  };
  return (
    <Container>
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
            setNumberPickerShow={setNumberPickerShow}
          />
        </MenuContainer>
      )}

      {/* 끼니 수량 조절용 BottomSheet */}
      <DBottomSheet
        alertShow={numberPickerShow}
        setAlertShow={setNumberPickerShow}
        renderContent={() => (
          <NumberPickerContent
            setNumberPickerShow={setNumberPickerShow}
            dietNoToNumControl={dietNoToNumControl}
          />
        )}
        onCancel={() => setNumberPickerShow(false)}
      />
    </Container>
  );
};

export default MenuSection;

const Container = styled.View`
  background-color: ${colors.backgroundLight2};
  padding: 0 0 8px;
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
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: ${colors.white};
`;

const Arrow = styled.Image`
  width: 20px;
  height: 20px;
  align-self: center;
  z-index: -1;
`;

const MenuContainer = styled.View`
  background-color: ${colors.white};
  padding: 0px 8px 16px 8px;
`;

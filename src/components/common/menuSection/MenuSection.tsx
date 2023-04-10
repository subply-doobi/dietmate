// react, RN, 3rd
import {useState} from 'react';
import {ScrollView} from 'react-native';
import styled from 'styled-components/native';

// doobi util, redux, etc
import {useSelector} from 'react-redux';
import {RootState} from '../../../stores/store';
import {icons} from '../../../assets/icons/iconSource';
import {Row} from '../../../styles/styledConsts';
import {findDietSeq} from '../../../util/findDietSeq';
import colors from '../../../styles/colors';

// doobi Components
import DAlert from '../alert/DAlert';
import MenuSelectCard from './MenuSelectCard';
import DeleteAlertContent from '../alert/DeleteAlertContent';
import NutrientsProgress from '../nutrient/NutrientsProgress';

// react-query
import {useDeleteDiet, useListDiet} from '../../../query/queries/diet';

const MenuSection = () => {
  // redux
  const {currentDietNo} = useSelector((state: RootState) => state.cart);

  // react-query
  const {data: dietData} = useListDiet();
  const deleteDietMutation = useDeleteDiet();

  // state
  const [dietNoToDelete, setDietNoToDelete] = useState<string>();
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);

  // etc
  const onDeleteDiet = () => {
    if (!dietData) return;
    dietNoToDelete && deleteDietMutation.mutate({dietNo: dietNoToDelete});
    setDeleteAlertShow(false);
  };

  return (
    <Container>
      <HeaderRow>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <MenuSelectCard />
        </ScrollView>
        <DeleteBtn
          onPress={() => {
            setDietNoToDelete(currentDietNo);
            setDeleteAlertShow(true);
          }}>
          <DeleteImg source={icons.deleteRound_18} />
        </DeleteBtn>
      </HeaderRow>
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
      <ProgressContainer>
        {currentDietNo && <NutrientsProgress currentDietNo={currentDietNo} />}
      </ProgressContainer>
    </Container>
  );
};

export default MenuSection;

const Container = styled.View`
  background-color: ${colors.backgroundLight2};
  padding: 0 0 8px;
  width: 100%;
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
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: ${colors.white};
`;

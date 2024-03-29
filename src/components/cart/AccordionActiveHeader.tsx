// react, RN, 3rd
import {useState} from 'react';
import styled from 'styled-components/native';

// doobi util, redux, etc
import {icons} from '../../shared/iconSource';
import colors from '../../shared/colors';
import {commaToNum, sumUpPrice} from '../../shared/utils/sumUp';

// doobi Component
import {Row, StyledProps} from '../../shared/ui/styledConsts';
import DAlert from '../common/alert/DAlert';
import DeleteAlertContent from '../common/alert/DeleteAlertContent';

// react-query
import {useDeleteDiet, useListDiet} from '../../shared/api/queries/diet';
import {queryClient} from '../../app/store/reactQueryStore';
import {DIET_DETAIL} from '../../shared/api/keys';
import {IDietDetailData} from '../../shared/api/types/diet';

interface IAccordionActiveHeader {
  idx: number;
  dietNo: string;
  dietSeq: string;
  dietDetailData: IDietDetailData;
}
const AccordionActiveHeader = ({
  idx,
  dietNo,
  dietSeq,
  dietDetailData,
}: IAccordionActiveHeader) => {
  // react-query
  const {data: dietData} = useListDiet();
  const deleteDietMutation = useDeleteDiet();

  // state
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);

  // etc
  const priceSum = sumUpPrice(dietDetailData);

  const onDeleteDiet = () => {
    deleteDietMutation.mutate({dietNo});
    setDeleteAlertShow(false);
    queryClient.invalidateQueries({queryKey: [DIET_DETAIL, dietNo]});
  };

  return (
    <Container backgroundColor={colors.dark}>
      <MenuSeq>{dietSeq}</MenuSeq>
      {dietData && dietData?.length > 1 && (
        <DeleteBtn
          onPress={() => setDeleteAlertShow(true)}
          disabled={dietData && dietData?.length > 1 ? false : true}>
          <DeleteImage source={icons.cancelRound_24} />
        </DeleteBtn>
      )}
      <DAlert
        alertShow={deleteAlertShow}
        renderContent={() => <DeleteAlertContent deleteText={dietSeq} />}
        onConfirm={() => onDeleteDiet()}
        onCancel={() => setDeleteAlertShow(false)}
      />
    </Container>
  );
};

export default AccordionActiveHeader;

const Container = styled.View`
  height: 48px;
  width: 100%;
  margin-top: 24px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background-color: ${({backgroundColor}: StyledProps) =>
    backgroundColor ?? colors.dark};
`;

const MenuSeq = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.white};
  margin-left: 8px;
`;

const PriceSum = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-right: 16px;
  color: ${colors.white};
`;

const DeleteBtn = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const DeleteImage = styled.Image`
  width: 24px;
  height: 24px;
`;

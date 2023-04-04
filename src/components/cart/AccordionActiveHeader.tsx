// react, RN, 3rd
import styled from 'styled-components/native';

// doobi util, redux, etc
import {icons} from '../../assets/icons/iconSource';
import colors from '../../styles/colors';

// doobi Component
import {Row, StyledProps, TextMain} from '../../styles/styledConsts';

// react-query
import {
  useCreateDiet,
  useDeleteDiet,
  useGetDietDetailEmptyYn,
  useListDiet,
} from '../../query/queries/diet';
import {useState} from 'react';
import {commaToNum, sumUpPrice} from '../../util/sumUp';
import DAlert from '../common/alert/DAlert';
import DeleteAlertContent from '../common/alert/DeleteAlertContent';
import {queryClient} from '../../query/store';
import {DIET_DETAIL} from '../../query/keys';
import {IDietDetailData} from '../../query/types/diet';
import AutoDietModal from './AutoDietModal';

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

  const HeaderColor = !dietDetailData
    ? colors.dark
    : dietDetailData.length === 0
    ? colors.dark
    : idx % 5 === 0
    ? colors.main
    : idx % 5 === 1
    ? colors.blue
    : idx % 5 === 2
    ? colors.green
    : idx % 5 === 3
    ? colors.orange
    : colors.warning;

  const onDeleteDiet = () => {
    deleteDietMutation.mutate({dietNo});
    setDeleteAlertShow(false);
    queryClient.invalidateQueries({queryKey: [DIET_DETAIL, dietNo]});
  };

  return (
    <Container backgroundColor={HeaderColor}>
      <MenuSeq>{dietSeq}</MenuSeq>
      <Row>
        <PriceSum>{commaToNum(priceSum)}원</PriceSum>
        <DeleteBtn
          onPress={() => setDeleteAlertShow(true)}
          disabled={dietData && dietData?.length > 1 ? false : true}>
          {dietData && dietData?.length > 1 && (
            <DeleteImage source={icons.cancelRound_24} />
          )}
        </DeleteBtn>
      </Row>
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
  margin-top: 16px;
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
  margin-left: 16px;
`;

const PriceSum = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-left: 24px;
  color: ${colors.white};
`;

const DeleteBtn = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;

const DeleteImage = styled.Image`
  width: 24px;
  height: 24px;
`;

// 3rd
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
import {useState} from 'react';

// doobi
import {IDietBaseData, IDietDetailData} from '../../shared/api/types/diet';
import colors from '../../shared/colors';
import {IBaseLineData} from '../../shared/api/types/baseLine';
import {Col, Icon, Row, TextMain, TextSub} from '../../shared/ui/styledComps';
import {icons} from '../../shared/iconSource';
import {getNutrStatus, sumUpPrice, commaToNum} from '../../shared/utils/sumUp';
import {RootState} from '../../app/store/reduxStore';
import {useDeleteDiet} from '../../shared/api/queries/diet';
import DAlert from '../../shared/ui/DAlert';
import CommonAlertContent from '../common/alert/CommonAlertContent';

interface IMenuAcActiveHeader {
  bLData: IBaseLineData;
  dBData: IDietBaseData;
  dDData: IDietDetailData;
}
const MenuAcActiveHeader = ({bLData, dBData, dDData}: IMenuAcActiveHeader) => {
  // redux
  const {totalFoodList} = useSelector((state: RootState) => state.common);

  // useState
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);

  // react-query
  const deleteDietMutation = useDeleteDiet();

  // fn
  const onDietDelete = () => {
    deleteDietMutation.mutate({dietNo: dBData.dietNo});
    setDeleteAlertShow(false);
  };

  // etc
  const priceSum = sumUpPrice(dDData);
  const nutrStatus = getNutrStatus({totalFoodList, bLData, dDData});
  const iconSource =
    nutrStatus === 'satisfied' ? icons.checkRoundChecked_24 : icons.warning_24;

  return (
    <Box>
      <Row>
        <Title>{dBData.dietSeq}</Title>
        {(nutrStatus === 'satisfied' || nutrStatus === 'exceed') && (
          <Icon style={{marginLeft: 4}} size={20} source={iconSource} />
        )}
      </Row>
      <SubTitle>{`${commaToNum(priceSum)}원 (${dDData.length}가지 식품)`}</SubTitle>
      <DeleteBtn onPress={() => setDeleteAlertShow(true)}>
        <Icon source={icons.cancelRound_24} />
      </DeleteBtn>

      <DAlert
        alertShow={deleteAlertShow}
        onCancel={() => setDeleteAlertShow(false)}
        onConfirm={() => onDietDelete()}
        NoOfBtn={2}
        renderContent={() => (
          <CommonAlertContent text={`${dBData.dietSeq}을\n삭제할까요`} />
        )}
      />
    </Box>
  );
};

export default MenuAcActiveHeader;

const Box = styled.View`
  width: 100%;
  height: 48px;
  flex-direction: row;
  background-color: ${colors.dark};
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const Title = styled(TextMain)`
  margin-left: 16px;
  font-weight: bold;
  font-size: 18px;
  line-height: 24px;
  color: ${colors.white};
`;

const SubTitle = styled(TextSub)`
  color: ${colors.white};
  font-size: 14px;
  margin-right: 56px;
  line-height: 18px;
`;

const DeleteBtn = styled.TouchableOpacity`
  position: absolute;
  right: 8px;
  width: 32px;
  height: 32px;

  align-self: center;
  justify-content: center;
  align-items: center;
`;

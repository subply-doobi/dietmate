// RN

// 3rd
import styled from 'styled-components/native';
import {RootState} from '../../app/store/reduxStore';
import {useSelector} from 'react-redux';

// doobi
import {IDietBaseData, IDietDetailData} from '../../shared/api/types/diet';
import {Col, Icon, Row, TextMain, TextSub} from '../../shared/ui/styledComps';
import colors from '../../shared/colors';
import {commaToNum, getNutrStatus, sumUpPrice} from '../../shared/utils/sumUp';
import {icons} from '../../shared/iconSource';
import {IBaseLineData} from '../../shared/api/types/baseLine';
import MenuNumSelect from '../cart/MenuNumSelect';
import DAlert from '../../shared/ui/DAlert';
import {useState} from 'react';
import CommonAlertContent from '../common/alert/CommonAlertContent';
import {
  useDeleteDiet,
  useListDietTotalObj,
} from '../../shared/api/queries/diet';

interface IMenuAcInactiveHeader {
  controllable?: boolean;
  dietNo: string;
  bLData: IBaseLineData;
  selected?: boolean;
  leftBarInactive?: boolean;
  setDietNoToNumControl?: React.Dispatch<React.SetStateAction<string>>;
  setMenuNumSelectShow?: React.Dispatch<React.SetStateAction<boolean>>;
}
const MenuAcInactiveHeader = ({
  controllable = true,
  dietNo,
  bLData,
  selected = false,
  leftBarInactive,
  setDietNoToNumControl,
  setMenuNumSelectShow,
}: IMenuAcInactiveHeader) => {
  // redux
  const {totalFoodList, currentDietNo} = useSelector(
    (state: RootState) => state.common,
  );

  // useState
  const [deleteAlertShow, setDeleteAlertShow] = useState(false);

  // react-query
  const {data: dTOData} = useListDietTotalObj();
  const dDData = dTOData?.[dietNo]?.dietDetail ?? [];
  const dietSeq = dTOData?.[dietNo]?.dietSeq ?? '';
  const deleteDietMutation = useDeleteDiet();

  // fn
  const onMenuNoSelectPress = () => {
    if (!setDietNoToNumControl || !setMenuNumSelectShow || !dTOData) return;
    setDietNoToNumControl(dietNo);
    setMenuNumSelectShow(true);
  };

  const onDietDelete = () => {
    deleteDietMutation.mutate({dietNo});
    setDeleteAlertShow(false);
  };

  // etc
  const priceSum = sumUpPrice(dDData);
  const nutrStatus = getNutrStatus({totalFoodList, bLData, dDData});
  const iconSource =
    nutrStatus === 'satisfied'
      ? icons.checkRoundCheckedGreen_24
      : icons.warning_24;
  const subTitleText =
    dDData.length !== 0
      ? `${commaToNum(priceSum)}원 (${dDData.length}가지 식품)`
      : '식품을 담아보세요';
  const barColor = selected
    ? colors.main
    : leftBarInactive
      ? colors.inactivated
      : currentDietNo === dietNo
        ? colors.dark
        : colors.inactivated;

  const currentQty = dDData.length > 0 ? parseInt(dDData[0].qty, 10) : 1;

  return (
    <Box selected={selected}>
      <LeftBar style={{backgroundColor: barColor}} />
      <Col style={{marginLeft: 12, rowGap: 6}}>
        <Row>
          <Title>{dietSeq}</Title>
          {(nutrStatus === 'satisfied' || nutrStatus === 'exceed') && (
            <Icon style={{marginLeft: 4}} size={20} source={iconSource} />
          )}
        </Row>
        <SubTitle>{subTitleText}</SubTitle>
      </Col>

      {controllable && (
        <DeleteBtn onPress={() => setDeleteAlertShow(true)}>
          <Icon source={icons.cancelRound_24} />
        </DeleteBtn>
      )}

      {controllable && (
        <Col style={{position: 'absolute', right: 8, bottom: 8}}>
          <MenuNumSelect
            disabled={dDData.length === 0}
            action="openModal"
            currentQty={currentQty}
            openMenuNumSelect={onMenuNoSelectPress}
          />
        </Col>
      )}

      <DAlert
        alertShow={deleteAlertShow}
        onCancel={() => setDeleteAlertShow(false)}
        onConfirm={() => onDietDelete()}
        NoOfBtn={2}
        renderContent={() => (
          <CommonAlertContent text={`${dietSeq}을\n삭제할까요`} />
        )}
      />
    </Box>
  );
};

export default MenuAcInactiveHeader;

const Box = styled.View<{
  selected?: boolean;
}>`
  background-color: ${colors.white};
  width: 100%;
  height: 84px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${({selected}) =>
    selected ? colors.highlight : colors.inactivated};
  border-width: ${({selected}) => (selected ? '1px' : '1px')};
`;

const LeftBar = styled.View`
  position: absolute;
  left: 0;
  width: 4px;
  height: 100%;
  background-color: ${colors.inactivated};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const Title = styled(TextMain)`
  font-size: 18px;
  font-weight: bold;
  line-height: 24px;
`;

const SubTitle = styled(TextSub)`
  font-size: 14px;
  margin-right: 56px;
  line-height: 18px;
`;

const DeleteBtn = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

// 3rd
import styled from 'styled-components/native';

// doobi
import {IDietBaseData, IDietDetailData} from '../../shared/api/types/diet';
import colors from '../../shared/colors';
import {IBaseLineData} from '../../shared/api/types/baseLine';
import {Col, Icon, TextMain, TextSub} from '../../shared/ui/styledComps';
import {icons} from '../../shared/iconSource';
import {
  sumUpNutrients,
  checkNutrSatisfied,
  getExceedIdx,
  getNutrStatus,
  sumUpPrice,
  commaToNum,
} from '../../shared/utils/sumUp';
import {useSelector} from 'react-redux';
import {RootState} from '../../app/store/reduxStore';

interface IMenuAcActiveHeader {
  bLData: IBaseLineData;
  dBData: IDietBaseData;
  dDData: IDietDetailData;
}
const MenuAcActiveHeader = ({bLData, dBData, dDData}: IMenuAcActiveHeader) => {
  // redux
  const {totalFoodList} = useSelector((state: RootState) => state.common);

  // react-query
  const priceSum = sumUpPrice(dDData);

  const {cal, carb, protein, fat} = sumUpNutrients(dDData);
  const nutrStatus = getNutrStatus({totalFoodList, bLData, dDData});
  const hasExceedNutr = getExceedIdx(bLData, cal, carb, protein, fat) >= 0;

  return (
    <Box>
      <Title>{dBData.dietSeq}</Title>
      <SubTitle>{`${commaToNum(priceSum)}원 (${dDData.length}가지 식품)`}</SubTitle>
      <Col
        style={{
          position: 'absolute',
          right: 8,
          rowGap: 12,
          alignItems: 'flex-end',
        }}>
        {nutrStatus === 'satisfied' || nutrStatus === 'exceed' ? (
          <Icon
            source={
              nutrStatus === 'satisfied'
                ? icons.checkRoundChecked_24
                : icons.warning_24
            }
          />
        ) : (
          <Dummy />
        )}
      </Col>
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

const Dummy = styled.View`
  width: 24px;
  height: 24px;
`;

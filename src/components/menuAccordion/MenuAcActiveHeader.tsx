// 3rd
import styled from 'styled-components/native';

// doobi
import {IDietBaseData, IDietDetailData} from '../../shared/api/types/diet';
import colors from '../../shared/colors';
import {IBaseLineData} from '../../shared/api/types/baseLine';
import {Icon, TextMain} from '../../shared/ui/styledComps';
import {icons} from '../../shared/iconSource';
import {
  sumUpNutrients,
  checkNutrSatisfied,
  getExceedIdx,
} from '../../shared/utils/sumUp';

interface IMenuAcActiveHeader {
  bLData: IBaseLineData;
  dBData: IDietBaseData;
  dDData: IDietDetailData;
}
const MenuAcActiveHeader = ({bLData, dBData, dDData}: IMenuAcActiveHeader) => {
  const {cal, carb, protein, fat} = sumUpNutrients(dDData);
  const isSatisfied = checkNutrSatisfied(bLData, cal, carb, protein, fat);
  const hasExceedNutr = getExceedIdx(bLData, cal, carb, protein, fat) >= 0;

  return (
    <Box>
      <Title>{dBData.dietSeq}</Title>
      {(isSatisfied || hasExceedNutr) && (
        <Icon
          style={{marginRight: 8}}
          source={isSatisfied ? icons.checkRoundChecked_24 : icons.warning_24}
        />
      )}
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
  color: ${colors.white};
`;

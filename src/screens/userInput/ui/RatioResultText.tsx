// 3rd
import {useSelector} from 'react-redux';
import {RootState} from '../../../app/store/reduxStore';

// doobi
import {TextMain} from '../../../shared/ui/styledComps';
import styled from 'styled-components/native';
import {purposeCdToValue} from '../../../shared/constants';
import colors from '../../../shared/colors';
import {calculateCaloriesToNutr} from '../../../shared/utils/targetCalculation';

interface IRatioResultText {
  recommendedNutr: {
    tmr: string;
    calorie: string;
    carb: string;
    protein: string;
    fat: string;
  };
}
const RatioResultText = ({recommendedNutr}: IRatioResultText) => {
  const {weight, calorie, ratio, dietPurposeCd} = useSelector(
    (state: RootState) => state.userInput,
  );

  const {carb, protein, fat} = calculateCaloriesToNutr(
    ratio.value,
    calorie.value,
  );
  const purposeText = purposeCdToValue[dietPurposeCd.value].targetText;

  const ratioText: {[key: string]: string} = {
    SP005001: '55 : 20 : 25',
    SP005002: '20 : 20 : 60',
    SP005003: '40 : 40 : 20',
  };

  return (
    <Box>
      <BaseText>고객님이 입력한 칼로리</BaseText>
      <BoldText>
        {`${calorie.value}kcal`},{'\n'}
      </BoldText>
      <BaseText>선택한 영양성분 비율 </BaseText>
      <BaseText>
        <BoldText>{`${ratioText[ratio.value]}`}</BoldText> 로
      </BaseText>
      <BaseText>왼쪽과 같이 계산되었어요{'\n'}</BaseText>

      {Number(protein) >= Math.round((Number(weight.value) * 2.5) / 3) && (
        <BaseText>
          고객님 체중 기준으로{'\n'} "하루" 섭취 총 단백질 양이{'\n'}
          <BoldText>{Math.round(Number(weight.value) * 2.5)}g</BoldText> 을
          초과하지는 않도록
          {'\n'}
          설정해주세요{'\n'}
        </BaseText>
      )}

      <BaseText>
        <BoldText>{purposeText}</BoldText>을 위한
      </BaseText>
      <BaseText>"권장" 한 끼 목표섭취량: </BaseText>
      <BaseText>
        <BoldText>
          {`${recommendedNutr.calorie}kcal`} (하루 기준
          <BoldText>{` ${Number(recommendedNutr.calorie) * 3}kcal`})</BoldText>
        </BoldText>
      </BaseText>
    </Box>
  );
};

export default RatioResultText;

const Box = styled.View`
  padding: 16px;
`;

const BaseText = styled(TextMain)`
  font-size: 12px;
`;
const BoldText = styled(TextMain)`
  font-size: 12px;
  font-weight: bold;
`;

const LinkText = styled.Text`
  font-size: 12px;
  font-style: italic;
  color: ${colors.blue};
  text-decoration-line: underline;
`;

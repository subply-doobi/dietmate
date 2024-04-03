// 3rd
import {useSelector} from 'react-redux';
import {RootState} from '../../../app/store/reduxStore';

// doobi
import {TextMain} from '../../../shared/ui/styledComps';
import styled from 'styled-components/native';
import {
  KOREAN_NUTRITION_REFERENCE_URL,
  purposeCdToValue,
} from '../../../shared/constants';
import {link} from '../../../shared/utils/linking';
import colors from '../../../shared/colors';
import {calculateManualCalorie} from '../../../shared/utils/targetCalculation';

interface IManualResultText {
  recommendedNutr: {
    tmr: string;
    calorie: string;
    carb: string;
    protein: string;
    fat: string;
  };
}
const ManualResultText = ({recommendedNutr}: IManualResultText) => {
  const {weight, dietPurposeCd, carb, protein, fat} = useSelector(
    (state: RootState) => state.userInput,
  );
  const purposeText = purposeCdToValue[dietPurposeCd.value].targetText;

  const {totalCalorie} = calculateManualCalorie(
    carb.value,
    protein.value,
    fat.value,
  );

  return (
    <Box>
      <BaseText>고객님이 입력한 탄:단:지</BaseText>
      <BaseText>
        <BoldText>{`${carb.value}g : ${protein.value}g : ${fat.value}g`}</BoldText>{' '}
        로
      </BaseText>
      <BaseText>
        총 {totalCalorie}kcal로 계산되었어요{'\n'}
      </BaseText>

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

export default ManualResultText;

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

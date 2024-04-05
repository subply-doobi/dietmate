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

const AutoResultText = ({tmr, calorie}: {tmr: string; calorie: string}) => {
  const {dietPurposeCd} = useSelector((state: RootState) => state.userInput);
  const purposeText = purposeCdToValue[dietPurposeCd.value].targetText;
  const calorieModText =
    purposeCdToValue[dietPurposeCd.value].additionalCalorieText;
  const additionalCal = Number(
    purposeCdToValue[dietPurposeCd.value].additionalCalorie,
  );
  const purpose =
    additionalCal === 0 ? '유지' : additionalCal > 0 ? '증량' : '감량';

  const additionalCalText =
    purpose === '유지'
      ? ''
      : purpose === '증량'
        ? `하루에 ${calorieModText}을 추가하여\n`
        : `하루에 ${calorieModText}을 제한하여\n`;

  return (
    <Box>
      <BaseText>고객님의 기초대사량과</BaseText>
      <BaseText>활동대사량을 추정하여</BaseText>
      <BaseText>하루 총 사용하는 칼로리를</BaseText>
      <BaseText>
        <BoldText>{`${tmr}kcal`}</BoldText>로 계산했어요{'\n'}
      </BaseText>

      <BaseText>
        <BoldText>{purposeText}</BoldText>을 위해
      </BaseText>

      <BaseText>{additionalCalText}</BaseText>

      <BaseText>하루 목표섭취량:</BaseText>
      <BaseText>
        <BoldText>{`${Number(calorie) * 3}kcal`}</BoldText>를 권장합니다
      </BaseText>
      <BaseText>
        (한 끼니 기준
        <BoldText>
          {` ${calorie}kcal`}){'\n'}
        </BoldText>
      </BaseText>
      <BaseText>탄수화물, 단백질, 지방 비율은</BaseText>
      <LinkText onPress={() => link(KOREAN_NUTRITION_REFERENCE_URL)}>
        <BoldText>보건복지부 한국인 영양섭취기준(2020)</BoldText>
      </LinkText>
      <BaseText>에서 권장하는 비율로 설정했습니다.</BaseText>
    </Box>
  );
};

export default AutoResultText;

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

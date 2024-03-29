// RN, 3rd
import styled from 'styled-components/native';
import {useSelector} from 'react-redux';
//doobi util, redux, etc
import {RootState} from '../../app/store/reduxStore';
import colors from '../../shared/colors';
import {Col} from '../../shared/ui/styledConsts';
import {
  KOREAN_NUTRITION_REFERENCE_URL,
  purposeCdToValue,
} from '../../shared/constants';
import {calculateNutrTarget} from '../../shared/utils/targetCalculation';
import {useListCode} from '../../shared/api/queries/code';
import {getRecommendedNutr} from '../../screens/userInput/util/targetByReduxData';
import {link} from '../../shared/utils/linking';

const Auto = () => {
  // redux
  const userInputState = useSelector((state: RootState) => state.userInput);

  // react-query
  const {data: seqCodeData} = useListCode('SP008'); // SP008 : 운동빈도 (sportsSeqCd)
  const {data: timeCodeData} = useListCode('SP009'); // SP009 : 운동시간 (sportsTimeCd)
  const {data: strengthCodeData} = useListCode('SP010'); // SP010 : 운동강도 (sportsStrengthCd)

  // 목표영양 계산 필요. (이전에는 secondInput에서 계산했음)
  // 운동 횟수 : 안함 인 경우 -> 운동시간/강도 무시해주기!

  const purposeText =
    purposeCdToValue[userInputState.dietPurposeCd.value].targetText;
  const calorieModText =
    purposeCdToValue[userInputState.dietPurposeCd.value].additionalCalorieText;

  const {calorie, carb, protein, fat, tmr} = getRecommendedNutr(
    seqCodeData,
    timeCodeData,
    strengthCodeData,
    userInputState,
  );
  return (
    <ContentsContainer>
      <Col>
        <NutrientSummaryText>{`칼로리: ${calorie} kcal`}</NutrientSummaryText>
        <NutrientSummaryText>{`탄수화물: ${carb} g`}</NutrientSummaryText>
        <NutrientSummaryText>{`단백질: ${protein} g`}</NutrientSummaryText>
        <NutrientSummaryText>{`지방: ${fat} g`}</NutrientSummaryText>
      </Col>
      <Col style={{marginTop: 8}}>
        <NutrientSummaryText>
          {` 고객님의 기초대사량과 활동대사량을 추정하여 하루 총 사용하는 칼로리를${tmr}kcal로 계산했어요. `}
        </NutrientSummaryText>
        <NutrientSummaryText style={{marginTop: 4}}>
          {` ${purposeText}을 위해 하루에 ${calorieModText}를 제한하여 한 끼기준${calorie}kcal를 추천드립니다.`}
        </NutrientSummaryText>
        <NutrientSummaryText style={{marginTop: 4}}>
          탄수화물, 단백질, 지방 비율은{' '}
          <LinkText onPress={() => link(KOREAN_NUTRITION_REFERENCE_URL)}>
            보건복지부 한국인 영양섭취기준(2020)
          </LinkText>
          에서 권장하는 비율로 설정했습니다.
        </NutrientSummaryText>
      </Col>
    </ContentsContainer>
  );
};

export default Auto;

const ContentsContainer = styled.View`
  margin-top: 12px;
  border-width: 1px;
  border-color: ${colors.main};
  border-radius: 5px;
  padding: 16px;
`;

const NutrientSummaryText = styled.Text`
  font-size: 12px;
  color: ${colors.textMain};
`;

const LinkText = styled.Text`
  font-size: 12px;
  font-style: italic;
  color: ${colors.blue};
  text-decoration-line: underline;
`;

{
  /* <Pressable onPress={() => link(KOREAN_NUTRITION_REFERENCE_URL)}>
            <GuideHeaderSubText
              style={{
                marginTop: 0,
                fontStyle: 'italic',
                color: colors.blue,
                textDecorationLine: 'underline',
              }}>
              (보건복지부 한국인 영양소 섭취기준, 2020)
            </GuideHeaderSubText>
          </Pressable> */
}

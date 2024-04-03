// RN

// 3rd
import styled from 'styled-components/native';

// doobi
import {useListCode} from '../../../../shared/api/queries/code';
import {getRecommendedNutr} from '../../util/targetByUserInfo';
import {Col, Icon, Row, TextMain} from '../../../../shared/ui/styledComps';
import colors from '../../../../shared/colors';
import {icons} from '../../../../shared/iconSource';
import {IUserInputState} from '../../../../features/reduxSlices/userInputSlice';
import AutoResultText from '../AutoResultText';
import RatioResultText from '../RatioResultText';
import ManualResultText from '../ManualResultText';
import {
  calculateCaloriesToNutr,
  calculateManualCalorie,
} from '../../../../shared/utils/targetCalculation';
import ShadowView from '../../../../shared/ui/ShadowView';

const Result = ({userInputState}: {userInputState: IUserInputState}) => {
  // react-query
  const {data: seqCodeData} = useListCode('SP008'); // SP008 : 운동빈도 (sportsSeqCd)
  const {data: timeCodeData} = useListCode('SP009'); // SP009 : 운동시간 (sportsTimeCd)
  const {data: strengthCodeData} = useListCode('SP010'); // SP010 : 운동강도 (sportsStrengthCd)

  // 권장영양
  const recommendedNutr = getRecommendedNutr(
    seqCodeData,
    timeCodeData,
    strengthCodeData,
    userInputState,
  );
  const {
    calorie: calorieAuto,
    carb: carbAuto,
    protein: proteinAuto,
    fat: fatAuto,
    tmr,
  } = recommendedNutr;

  // input state
  const {ratio, calorie, carb, protein, fat} = userInputState;
  const targetOption =
    userInputState.targetOption.value[0] === 0
      ? 'auto'
      : userInputState.targetOption.value[0] === 1
        ? 'ratio'
        : 'manual';

  // 칼로리 + 비율로 계산한 영양소
  const {
    carb: carbByRatio,
    protein: proteinByRatio,
    fat: fatByRatio,
  } = calculateCaloriesToNutr(ratio.value, calorie.value);
  const {totalCalorie} = calculateManualCalorie(
    carb.value,
    protein.value,
    fat.value,
  );

  // 각 영양소 표시
  const nutrItems = [
    {
      name: '칼로리',
      value:
        targetOption === 'auto'
          ? calorieAuto
          : targetOption === 'ratio'
            ? calorie.value
            : totalCalorie,
      unit: 'kcal',
      color: colors.main,
    },
    {
      name: '탄수화물',
      value:
        targetOption === 'auto'
          ? carbAuto
          : targetOption === 'ratio'
            ? carbByRatio
            : carb.value,
      unit: 'g',
      color: colors.blue,
    },
    {
      name: '단백질',
      value:
        targetOption === 'auto'
          ? proteinAuto
          : targetOption === 'ratio'
            ? proteinByRatio
            : protein.value,
      unit: 'g',
      color: colors.green,
    },
    {
      name: '지방',
      value:
        targetOption === 'auto'
          ? fatAuto
          : targetOption === 'ratio'
            ? fatByRatio
            : fat.value,
      unit: 'g',
      color: colors.orange,
    },
  ];
  return (
    <Container>
      <Row style={{alignItems: 'center'}}>
        <Col style={{flex: 1, rowGap: 16}}>
          {nutrItems.map((item, idx) => (
            <NutrBox key={idx}>
              <LeftBar style={{backgroundColor: item.color}}></LeftBar>
              <Col style={{marginLeft: 12}}>
                <NutrText
                  style={{color: colors.textSub}}>{`${item.name}`}</NutrText>
                <NutrText>{`${item.value} ${item.unit}`}</NutrText>
              </Col>
            </NutrBox>
          ))}
        </Col>
        <ShadowView style={{flex: 1.5}}>
          <TMIBox>
            {userInputState.targetOption.value[0] === 0 ? (
              <AutoResultText tmr={tmr} calorie={calorieAuto} />
            ) : userInputState.targetOption.value[0] === 1 ? (
              <RatioResultText recommendedNutr={recommendedNutr} />
            ) : (
              <ManualResultText recommendedNutr={recommendedNutr} />
            )}
          </TMIBox>
        </ShadowView>
      </Row>
      <AdditionalGuideBox>
        <Icon source={icons.warning_24} />
        <AdditionalGuideText>
          다이어트메이트가 권장하는 목표영양은 하루 세 끼를 드시는 분들의 한 끼
          기준입니다.{'\n\n'} "마이페이지"에서 언제든지 목표영양을 수정할 수
          있으니 식사량이나 다이어트 경과에 따라 자신에게 맞게 설정해보세요
        </AdditionalGuideText>
      </AdditionalGuideBox>
    </Container>
  );
};

export default Result;

const Container = styled.View`
  flex: 1;
`;

const NutrBox = styled.View`
  flex-direction: row;
  width: 100%;
  height: 58px;
  align-items: center;
`;
const LeftBar = styled.View`
  width: 4px;
  height: 100%;
`;

const NutrText = styled(TextMain)`
  font-size: 16px;
`;

const TMIBox = styled.View`
  background-color: ${colors.backgroundLight};
  border-radius: 10px;
  margin-right: 4px;
`;

const AdditionalGuideBox = styled.View`
  width: 100%;
  background-color: ${colors.backgroundLight2};
  border-radius: 10px;

  margin-top: 40px;
  padding: 16px;
`;

const AdditionalGuideText = styled(TextMain)`
  font-size: 16px;
  margin-top: 8px;
`;

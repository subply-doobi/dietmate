// 3rd
import styled from 'styled-components/native';

// doobi
import {
  IUserInputState,
  setValue,
} from '../../../../features/reduxSlices/userInputSlice';
import SquareInput from '../../../../shared/ui/SquareInput';
import {useListCode} from '../../../../shared/api/queries/code';
import {getRecommendedNutr} from '../../util/targetByUserInfo';
import {useDispatch} from 'react-redux';
import {Col, TextMain, TextSub} from '../../../../shared/ui/styledComps';
import colors from '../../../../shared/colors';
import ToggleButton from '../../../../shared/ui/ToggleButton';
import {calculateCaloriesToNutr} from '../../../../shared/utils/targetCalculation';

const TargetRatio = ({userInputState}: {userInputState: IUserInputState}) => {
  // redux
  const dispatch = useDispatch();

  // react-query
  const {data: seqCodeData} = useListCode('SP008'); // SP008 : 운동빈도 (sportsSeqCd)
  const {data: timeCodeData} = useListCode('SP009'); // SP009 : 운동시간 (sportsTimeCd)
  const {data: strengthCodeData} = useListCode('SP010'); // SP010 : 운동강도 (sportsStrengthCd)
  const {data: ratioCodeData} = useListCode('SP005'); // SP005 : 탄단지비율

  const {calorie: targetCal, ratio} = userInputState;

  // 권장 칼로리
  const {calorie} = getRecommendedNutr(
    seqCodeData,
    timeCodeData,
    strengthCodeData,
    userInputState,
  );

  // 칼로리로 자동 계산된 각 영양성분
  const {carb, protein, fat} = calculateCaloriesToNutr(
    ratio.value,
    targetCal.value,
  );

  const nutrItems = [
    {name: '칼로리', value: targetCal.value, unit: 'kcal'},
    {name: '탄수화물', value: carb, unit: 'g'},
    {name: '단백질', value: protein, unit: 'g'},
    {name: '지방', value: fat, unit: 'g'},
  ];

  return (
    <Container>
      <SquareInput
        label={`목표칼로리 (권장: ${calorie}kcal)`}
        isActive={!!targetCal.value}
        value={targetCal.value}
        onChangeText={v => dispatch(setValue({name: 'calorie', value: v}))}
        errMsg={targetCal.errMsg}
        keyboardType="numeric"
        maxLength={4}
        placeholder={`목표칼로리를 입력해주세요 (권장: ${calorie}kcal)`}
      />
      <RatioOptionLabel>탄:단:지 비율을 선택해주세요</RatioOptionLabel>
      <Col style={{rowGap: 8, marginTop: 6}}>
        {ratioCodeData?.map((item, idx) => (
          <ToggleButton
            key={item.cdNm}
            isActive={ratio.value === item.cd}
            label={item.cdNm}
            style={{width: '100%', height: 48}}
            onPress={() => dispatch(setValue({name: 'ratio', value: item.cd}))}
          />
        ))}
      </Col>
      <NutrBox>
        {nutrItems.map((item, idx) => (
          <Col key={item.name} style={{flex: 1, alignItems: 'center'}}>
            <NutrTitle>{item.name}</NutrTitle>
            <NutrValue>{`${item.value} ${item.unit}`}</NutrValue>
          </Col>
        ))}
      </NutrBox>
    </Container>
  );
};

export default TargetRatio;

const Container = styled.View``;

const RatioOptionLabel = styled(TextMain)`
  font-size: 11px;
  font-weight: bold;
  line-height: 16px;
  margin-left: 4px;
  margin-top: 24px;
`;

const NutrBox = styled.View`
  width: 100%;
  height: 58px;
  flex-direction: row;

  border-color: ${colors.main};
  border-width: 1px;
  border-radius: 5px;

  align-items: center;
  justify-content: space-between;

  margin-top: 24px;
`;

const NutrTitle = styled(TextSub)`
  font-size: 12px;
`;
const NutrValue = styled(TextMain)`
  font-size: 12px;
  margin-top: 2px;
`;

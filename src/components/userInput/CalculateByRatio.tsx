//RN, 3rd
import styled from 'styled-components/native';

//doobi util, redux, etc
import colors from '../../styles/colors';
import {NUTR_RATIO_CD} from '../../constants/constants';
import {calculateCaloriesToNutr} from '../../util/targetCalculation';
//Doobi components
import {
  ErrorBox,
  ErrorText,
  InputHeaderText,
  UserInfoTextInput,
} from '../../styles/styledConsts';

import Dropdown from './Dropdown';
import {getRecommendedNutr} from '../../util/userInput/targetByReduxData';
import {RootState} from '../../stores/store';
import {useDispatch, useSelector} from 'react-redux';
import {useListCode} from '../../query/queries/code';
import {useEffect, useState} from 'react';
import {setValue} from '../../stores/slices/userInputSlice';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const CalculateByRatio = () => {
  // redux
  const dispatch = useDispatch();
  const userInputState = useSelector((state: RootState) => state.userInput);

  // react-query
  const {data: ratioCodeData} = useListCode('SP005'); // SP005 : 탄단지비율
  const {data: seqCodeData} = useListCode('SP008'); // SP008 : 운동빈도 (sportsSeqCd)
  const {data: timeCodeData} = useListCode('SP009'); // SP009 : 운동시간 (sportsTimeCd)
  const {data: strengthCodeData} = useListCode('SP010'); // SP010 : 운동강도 (sportsStrengthCd)

  // useState
  const [ratioTemp, setRatioTemp] = useState(userInputState.ratio.value);

  // useEffect
  useEffect(() => {
    // dropdown picker는 useState set function만 가능해서 redux로 다시 넘기기
    dispatch(setValue({name: 'ratio', value: ratioTemp}));
  }, [ratioTemp]);

  // etc
  const ratioDDItems = ratioCodeData?.map(item => {
    return {value: item.cd, label: item.cdNm};
  });

  // 칼로리로 자동 계산된 각 영양성분
  const {carb, protein, fat} = calculateCaloriesToNutr(
    userInputState.ratio.value,
    userInputState.calorie.value,
  );

  // 권장 칼로리
  const {calorie: recommendedCalorie} = getRecommendedNutr(
    seqCodeData,
    timeCodeData,
    strengthCodeData,
    userInputState,
  );

  return (
    <ContentContainer>
      {/* 탄단지 비율 */}
      <Dropdown
        placeholder="탄:단:지 비율"
        items={
          ratioCodeData
            ? ratioDDItems
            : NUTR_RATIO_CD.map(item => ({value: item.cd, label: item.cdNm}))
        }
        value={ratioTemp}
        setValue={setRatioTemp}
      />

      {/* --- 한 끼 칼로리 --- */}
      <InputHeader isActivated={!!userInputState.calorie}>
        한 끼 칼로리 (kcal)
      </InputHeader>
      <Input
        placeholder={`한 끼 칼로리 입력 (권장: ${recommendedCalorie})`}
        value={userInputState.calorie.value}
        onChangeText={v => dispatch(setValue({name: 'calorie', value: v}))}
        onFocus={() => {}}
        isActivated={!!userInputState.calorie}
        keyboardType="numeric"
        maxLength={4}
      />

      {userInputState.calorie.errMsg && (
        <ErrorBox>
          <ErrorText>{userInputState.calorie.errMsg}</ErrorText>
        </ErrorBox>
      )}
      <SummaryContainer>
        <NutrientSummaryText>{`칼로리: ${
          userInputState.calorie.value || '0 '
        } kcal`}</NutrientSummaryText>
        <NutrientSummaryText>{`탄수화물: ${
          carb ? parseInt(carb) : '  '
        } g`}</NutrientSummaryText>
        <NutrientSummaryText>{`단백질: ${
          protein ? parseInt(protein) : '  '
        } g`}</NutrientSummaryText>
        <NutrientSummaryText>{`지방: ${
          fat ? parseInt(fat) : '  '
        } g`}</NutrientSummaryText>
      </SummaryContainer>
    </ContentContainer>
  );
};

export default CalculateByRatio;

const ContentContainer = styled.View`
  padding-bottom: 30px;
`;

const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;
const Input = styled(UserInfoTextInput)``;

const SummaryContainer = styled.View`
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

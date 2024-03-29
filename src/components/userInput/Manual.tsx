import React, {useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {useDispatch, useSelector} from 'react-redux';

import {RootState} from '../../app/store/reduxStore';
import {
  ErrorBox,
  ErrorText,
  InputHeaderText,
  UserInfoTextInput,
} from '../../shared/ui/styledConsts';
import {calculateManualCalorie} from '../../shared/utils/targetCalculation';
import colors from '../../shared/colors';
import {getRecommendedNutr} from '../../screens/userInput/util/targetByReduxData';
import {useListCode} from '../../shared/api/queries/code';
import {setValue} from '../../features/reduxSlices/userInputSlice';
import DTextInput from '../common/textInput/DTextInput';

interface IManual {
  scrollRef?: any;
}
const Manual = ({scrollRef}: IManual) => {
  // redux
  const dispatch = useDispatch();
  const userInputState = useSelector((state: RootState) => state.userInput);
  const {carb, protein, fat} = userInputState;

  // react-query
  const {data: seqCodeData} = useListCode('SP008'); // SP008 : 운동빈도 (sportsSeqCd)
  const {data: timeCodeData} = useListCode('SP009'); // SP009 : 운동시간 (sportsTimeCd)
  const {data: strengthCodeData} = useListCode('SP010'); // SP010 : 운동강도 (sportsStrengthCd)

  // ref
  const manualRefs = useRef([]);

  // etc
  // 권장 영양성분
  const {
    carb: carbRecommended,
    protein: proteinRecommended,
    fat: fatRecommended,
  } = getRecommendedNutr(
    seqCodeData,
    timeCodeData,
    strengthCodeData,
    userInputState,
  );

  // 자동으로 계산된 전체 칼로리 및 각 영양성분 칼로리 비율 구하기
  const {totalCalorie, carbRatio, proteinRatio, fatRatio} =
    calculateManualCalorie(carb.value, protein.value, fat.value);

  return (
    <ContentsContainer>
      {/* 탄수화물 직접 입력 */}
      <InputHeader isActivated={!!carb.value}>한 끼 탄수화물 (g)</InputHeader>
      <DTextInput
        placeholder={`한 끼 탄수화물 입력 (권장: ${carbRecommended})`}
        onFocus={() =>
          setTimeout(() => {
            scrollRef?.current.scrollToEnd({animated: true});
          }, 150)
        }
        value={carb.value}
        onChangeText={v => dispatch(setValue({name: 'carb', value: v}))}
        isActivated={!!carb.value}
        isValid={carb.isValid}
        keyboardType="numeric"
        maxLength={3}
        ref={el => {
          manualRefs ? (manualRefs.current[0] = el) : null;
        }}
        onSubmitEditing={() => {
          manualRefs?.current[1].focus();
        }}
      />
      {carb.errMsg && (
        <ErrorBox>
          <ErrorText>{carb.errMsg}</ErrorText>
        </ErrorBox>
      )}
      {/* 단백질 직접 입력 */}
      <InputHeader isActivated={!!protein.value}>한 끼 단백질 (g)</InputHeader>
      <DTextInput
        placeholder={`한 끼 단백질 입력 (권장: ${proteinRecommended})`}
        onFocus={() =>
          setTimeout(() => {
            scrollRef?.current.scrollToEnd({animated: true});
          }, 150)
        }
        value={protein.value}
        onChangeText={v => dispatch(setValue({name: 'protein', value: v}))}
        isActivated={!!protein.value}
        isValid={protein.isValid}
        keyboardType="numeric"
        maxLength={3}
        ref={el => {
          manualRefs ? (manualRefs.current[1] = el) : null;
        }}
        onSubmitEditing={() => {
          manualRefs?.current[2].focus();
        }}
      />
      {protein.errMsg && (
        <ErrorBox>
          <ErrorText>{protein.errMsg}</ErrorText>
        </ErrorBox>
      )}

      {/* 지방 직접 입력 */}
      <InputHeader isActivated={!!fat.value}>한 끼 지방 (g)</InputHeader>
      <DTextInput
        placeholder={`한 끼 지방 입력 (권장: ${fatRecommended})`}
        onFocus={() =>
          setTimeout(() => {
            scrollRef?.current.scrollToEnd({animated: true});
          }, 150)
        }
        value={fat.value}
        onChangeText={v => dispatch(setValue({name: 'fat', value: v}))}
        isActivated={!!fat.value}
        isValid={fat.isValid}
        keyboardType="numeric"
        maxLength={3}
        ref={el => {
          manualRefs ? (manualRefs.current[2] = el) : null;
        }}
      />
      {fat.errMsg && (
        <ErrorBox>
          <ErrorText>{fat.errMsg}</ErrorText>
        </ErrorBox>
      )}

      {/* 요약 */}
      <SummaryContainer>
        <NutrientSummaryText>
          칼로리: {totalCalorie || '   '}kcal ( {carbRatio || '  '} :{' '}
          {proteinRatio || '  '} : {fatRatio || '  '} )
        </NutrientSummaryText>
      </SummaryContainer>
    </ContentsContainer>
  );
};

export default Manual;

const ContentsContainer = styled.View``;
const InputHeader = styled(InputHeaderText)`
  margin-top: 24px;
`;

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

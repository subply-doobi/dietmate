import {ICodeData} from '../../../shared/api/types/code';
import {IUserInputState} from '../../../features/reduxSlices/userInputSlice';
import {calculateCaloriesToNutr} from '../../../shared/utils/targetCalculation';
import {getRecommendedNutr} from './targetByUserInfo';

// 자동계산
export const setSubmitDataByAuto = (
  userInputState: IUserInputState,
  seqCodeData: ICodeData | undefined,
  timeCodeData: ICodeData | undefined,
  strengthCodeData: ICodeData | undefined,
) => {
  console.log('autoMethodSubmit!');
  const {calorie, carb, protein, fat} = getRecommendedNutr(
    seqCodeData,
    timeCodeData,
    strengthCodeData,
    userInputState,
  );
  return {
    calorie,
    carb,
    protein,
    fat,
    gender: userInputState.gender.value,
    age: userInputState.age.value,
    height: userInputState.height.value,
    weight: userInputState.weight.value,
    dietPurposeCd: userInputState.dietPurposeCd.value,
    sportsSeqCd: userInputState.sportsSeqCd.value,
    sportsTimeCd: userInputState.sportsTimeCd.value,
    sportsStrengthCd: userInputState.sportsStrengthCd.value,
  };
};
// 영양비율, 칼로리 입력
export const setSubmitDataByRatio = (userInputState: IUserInputState) => {
  console.log('ratioMethodSubmit!');
  const {carb, protein, fat} = calculateCaloriesToNutr(
    userInputState.ratio.value,
    userInputState.calorie.value,
  );
  return {
    calorie: userInputState.calorie.value,
    carb: String(carb),
    protein: String(protein),
    fat: String(fat),
    gender: userInputState.gender.value,
    age: userInputState.age.value,
    height: userInputState.height.value,
    weight: userInputState.weight.value,
    dietPurposeCd: userInputState.dietPurposeCd.value,
    sportsSeqCd: userInputState.sportsSeqCd.value,
    sportsTimeCd: userInputState.sportsTimeCd.value,
    sportsStrengthCd: userInputState.sportsStrengthCd.value,
  };
};

// 탄단지 직접입력
export const setSubmitDataByManual = (userInputState: IUserInputState) => {
  const calorie =
    parseInt(userInputState.carb.value) * 4 +
    parseInt(userInputState.protein.value) * 4 +
    parseInt(userInputState.fat.value) * 9;
  return {
    calorie,
    carb: userInputState.carb.value,
    protein: userInputState.protein.value,
    fat: userInputState.fat.value,
    gender: userInputState.gender.value,
    age: userInputState.age.value,
    height: userInputState.height.value,
    weight: userInputState.weight.value,
    dietPurposeCd: userInputState.dietPurposeCd.value,
    sportsSeqCd: userInputState.sportsSeqCd.value,
    sportsTimeCd: userInputState.sportsTimeCd.value,
    sportsStrengthCd: userInputState.sportsStrengthCd.value,
  };
};

interface IConvertDataByMethod {
  [key: number]: Function;
}
export const convertDataByMethod: IConvertDataByMethod = {
  0: setSubmitDataByAuto,
  1: setSubmitDataByRatio,
  2: setSubmitDataByManual,
};

import {IUserInfo, IUserTarget} from '../stores/slices/userInfoSlice';
import {calculateCaloriesToNutr} from './targetCalculation';

interface ISubmitParams {
  userInfo: IUserInfo;
  userTarget: IUserTarget;
  ratioType: string;
  caloriePerMeal: string;
  carbManual: string;
  proteinManual: string;
  fatManual: string;
}

const convertDataByAutoMethod = ({userInfo, userTarget}: ISubmitParams) => {
  return {...userInfo, ...userTarget};
};
const convertDataByRatioMethod = ({
  userInfo,
  userTarget,
  ratioType,
  caloriePerMeal,
}: ISubmitParams) => {
  console.log('ratioMethodSubmit!');
  const {carb, protein, fat} = calculateCaloriesToNutr(
    ratioType,
    caloriePerMeal,
  );

  return {
    companyCd: '',
    userId: '',
    calorie: caloriePerMeal,
    carb: String(carb),
    protein: String(protein),
    fat: String(fat),
    gender: userInfo.gender,
    age: userInfo.age,
    height: userInfo.height,
    weight: userInfo.weight,
    dietPurposeCd: userInfo.dietPurposeCd,
    sportsTimeCd: userInfo.sportsTimeCd,
    sportsIntensityCd: userInfo.sportsStrengthCd,
    sportsSeq: userInfo.sportsSeqCd,
  };
};
const convertDataByManualMethod = ({
  userInfo,
  userTarget,
  carbManual,
  proteinManual,
  fatManual,
}: ISubmitParams) => {
  console.log('manualMethodSubmit!');
  const calorieTarget =
    parseInt(carbManual) * 4 +
    parseInt(proteinManual) * 4 +
    parseInt(fatManual) * 9;

  return {
    companyCd: '',
    userId: '',
    calorie: String(calorieTarget),
    carb: carbManual,
    protein: proteinManual,
    fat: fatManual,
    gender: userInfo.gender,
    age: userInfo.age,
    height: userInfo.height,
    weight: userInfo.weight,
    dietPurposeCd: userInfo.dietPurposeCd,
    sportsTimeCd: userInfo.sportsTimeCd,
    sportsIntensityCd: userInfo.sportsStrengthCd,
    sportsSeq: userInfo.sportsSeqCd,
  };
};

interface IConvertDataByMethod {
  [key: number]: Function;
}
export const convertDataByMethod: IConvertDataByMethod = {
  0: convertDataByAutoMethod,
  1: convertDataByRatioMethod,
  2: convertDataByManualMethod,
};

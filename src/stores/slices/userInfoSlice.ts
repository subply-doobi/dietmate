import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

import {
  aerobicTrainingCategrory,
  purposeCategory,
  weightTrainingCategrory,
} from '../../constants/constants';

export interface IUserInfo {
  nickNm: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  dietPurposeCd: string;
  sportsSeqCd: string;
  sportsTimeCd: string;
  sportsStrengthCd: string;
  bmr: string;
}

export interface IUserTarget {
  [key: string]: string;
  tmr: string;
  calorie: string;
  carb: string;
  protein: string;
  fat: string;
}

export interface userInfoState {
  userInfo: IUserInfo;
  userTarget: IUserTarget;
}

const initialState: userInfoState = {
  userInfo: {
    nickNm: '',
    gender: 'M',
    age: '',
    height: '',
    weight: '',
    dietPurposeCd: purposeCategory[0].value,
    bmr: '',
    sportsSeqCd: '',
    sportsTimeCd: '',
    sportsStrengthCd: '',
  },
  userTarget: {
    tmr: '',
    calorie: '',
    carb: '',
    protein: '',
    fat: '',
  },
};

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    saveUserInfo: (
      state,
      action: PayloadAction<{
        gender?: string;
        age?: string;
        height?: string;
        weight?: string;
        dietPurposeCd?: string;
        sportsSeqCd?: string;
        sportsTimeCd?: string;
        sportsStrengthCd?: string;
        bmr?: string;
      }>,
    ) => {
      state.userInfo = {...state.userInfo, ...action.payload};
    },
    saveUserTarget: (
      state,
      action: PayloadAction<{
        tmr?: string;
        calorie?: string;
        carb?: string;
        protein?: string;
        fat?: string;
      }>,
    ) => {
      state.userTarget = {...state.userTarget, ...action.payload};
    },
    updateUserInfo: (
      state,
      action: PayloadAction<{
        tmr?: string;
        weight?: string;
        calorie?: string;
        carb?: string;
        protein?: string;
        fat?: string;
      }>,
    ) => {
      const {tmr, weight, calorie, carb, protein, fat} = action.payload;
      const isWeightChange = tmr && weight;
      const isNutrChange = calorie && carb && protein && fat;
      if (isWeightChange && isNutrChange) {
        console.log('updateUserInfo: 몸무게 -> 자동계산');
        // state = {
        //   ...state,
        //   userInfo: {
        //     ...state.userInfo,
        //     // 변경
        //   },
        //   userTarget: {
        //     ...state.userTarget,
        //     // 변경
        //   }
        // }
        state.userInfo = {
          ...state.userInfo,
          weight: weight,
        };
        state.userTarget = {
          ...state.userTarget,
          tmr: tmr,
          calorie: calorie,
          carb: carb,
          protein: protein,
          fat: fat,
        };
      } else if (isWeightChange && !isNutrChange) {
        console.log('updateUserInfo: 몸무게만');
        console.log(weight);
        state.userInfo = {
          ...state.userInfo,
          weight: weight,
        };
        state.userTarget = {
          ...state.userTarget,
          tmr: tmr,
        };
      } else if (!isWeightChange && isNutrChange) {
        console.log('updateUserInfo: 영양만');
        state.userTarget = {
          ...state.userTarget,
          calorie: calorie,
          carb: carb,
          protein: protein,
          fat: fat,
        };
      }
    },
    resetUserInfo: state => {
      state.userInfo = initialState.userInfo;
      state.userTarget = initialState.userTarget;
    },
  },
});

export const {saveUserInfo, saveUserTarget, updateUserInfo, resetUserInfo} =
  userInfoSlice.actions;
export default userInfoSlice.reducer;

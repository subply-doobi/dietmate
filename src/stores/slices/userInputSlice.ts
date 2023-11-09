import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  DIET_PURPOSE_CD,
  NUTR_RATIO_CD,
  SPORTS_SEQ_CD,
  SPORTS_STRENGTH_CD,
  SPORTS_TIME_CD,
  validateBaseLine,
} from '../../constants/constants';
import {IBaseLine} from '../../query/types/baseLine';

export interface UserInputState {
  // FirstInput
  gender: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  age: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  height: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  weight: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  dietPurposeCd: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };

  // SecondInput
  sportsSeqCd: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  sportsTimeCd: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  sportsStrengthCd: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  bmrKnown: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };

  // ThirdInput
  ratio: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  calorie: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  carb: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  protein: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  fat: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
}

const initialState: UserInputState = {
  // FirstInput
  gender: {
    value: 'M',
    isValid: true,
    errMsg: '',
  },
  age: {
    value: '',
    isValid: false,
    errMsg: '',
  },
  height: {
    value: '',
    isValid: false,
    errMsg: '',
  },
  weight: {
    value: '',
    isValid: false,
    errMsg: '',
  },
  dietPurposeCd: {
    value: DIET_PURPOSE_CD[0].cd,
    isValid: false,
    errMsg: '',
  },

  // SecondInput
  sportsSeqCd: {
    value: SPORTS_SEQ_CD[0].cd,
    isValid: true,
    errMsg: '',
  },
  sportsTimeCd: {
    value: SPORTS_TIME_CD[0].cd,
    isValid: true,
    errMsg: '',
  },
  sportsStrengthCd: {
    value: SPORTS_STRENGTH_CD[0].cd,
    isValid: true,
    errMsg: '',
  },
  bmrKnown: {
    value: '',
    isValid: true,
    errMsg: '',
  },

  // ThirdInput
  ratio: {
    value: NUTR_RATIO_CD[0].cd,
    isValid: true,
    errMsg: '',
  },
  calorie: {
    value: '',
    isValid: false,
    errMsg: '한 끼 목표 칼로리를 입력해주세요',
  },
  carb: {
    value: '',
    isValid: false,
    errMsg: '한 끼 목표 탄수화물을 입력해주세요',
  },
  protein: {
    value: '',
    isValid: false,
    errMsg: '한 끼 목표 단백질을 입력해주세요',
  },
  fat: {
    value: '',
    isValid: false,
    errMsg: '한 끼 목표 지방을 입력해주세요',
  },
};

const userInputSlice = createSlice({
  name: 'userInput',
  initialState,
  reducers: {
    initializeInput: state => {
      state = initialState;
    },
    loadBaseLineData: (state, action: PayloadAction<IBaseLine>) => {
      // FirstInput
      state.gender.value = action.payload.gender;
      state.age.value = action.payload.age;
      state.height.value = action.payload.height;
      state.weight.value = action.payload.weight;
      state.dietPurposeCd.value = action.payload.dietPurposeCd;
      state.age.isValid = true;
      state.height.isValid = true;
      state.weight.isValid = true;
      // SecondInput
      state.sportsSeqCd.value = action.payload.sportsSeqCd;
      state.sportsTimeCd.value = action.payload.sportsTimeCd;
      state.sportsStrengthCd.value = action.payload.sportsStrengthCd;
      state.bmrKnown.value = '';
      state.bmrKnown.isValid = true;
      // ThirdInput
      state.ratio.value = NUTR_RATIO_CD[0].cd;
      state.calorie.value = '';
      state.carb.value = '';
      state.protein.value = '';
      state.fat.value = '';
    },
    setValue: (
      state,
      action: PayloadAction<{
        name: keyof UserInputState;
        value: UserInputState[keyof UserInputState]['value'];
      }>,
    ) => {
      const {name, value} = action.payload;
      state[name].value = value;
      // 운동 "안함" => 운동시간, 강도도 첫번째 선택지로
      if (name === 'sportsSeqCd' && value === SPORTS_SEQ_CD[0].cd) {
        state.sportsTimeCd.value = SPORTS_TIME_CD[0].cd;
        state.sportsStrengthCd.value = SPORTS_STRENGTH_CD[0].cd;
      }

      // validation
      if (!validateBaseLine[name]) {
        state[name].isValid = true;
        state[name].errMsg = '';
        return;
      }
      const {errMsg, isValid} = validateBaseLine[name](value);
      state[name].errMsg = errMsg;
      state[name].isValid = isValid;
    },
  },
});

export const {setValue, loadBaseLineData, initializeInput} =
  userInputSlice.actions;

export default userInputSlice.reducer;

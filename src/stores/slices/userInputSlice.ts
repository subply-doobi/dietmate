import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
  DIET_PURPOSE_CD,
  ENTRANCE_TYPE,
  NUTR_RATIO_CD,
  SPORTS_SEQ_CD,
  SPORTS_STRENGTH_CD,
  SPORTS_TIME_CD,
} from '../../constants/constants';
import {IBaseLineData} from '../../query/types/baseLine';
import {IAddressCreate, IAddressData} from '../../query/types/address';
import {formatPhone} from '../../util/format';
import {validateInput} from '../../util/userInput/validation';

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

  // Mypage calorie, carb, protein, fat change input
  calorieChange: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  carbChange: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  proteinChange: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  fatChange: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  weightChange: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };

  // Order input

  buyerName: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  buyerTel: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  addr1: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  addr2: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  zipCode: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  entranceType: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  entranceNote: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
  paymentMethod: {
    value: string;
    isValid: boolean;
    errMsg: string;
  };
}

// 선택사항 input의 경우는 isValid를 true로 설정, errMsg는 빈 문자열로 설정
// validation이 필요한 경우는 validateInput에 추가
export const initialState: UserInputState = {
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

  // Mypage change input
  calorieChange: {
    value: '',
    isValid: false,
    errMsg: '한 끼 목표 칼로리를 입력해주세요',
  },
  carbChange: {
    value: '',
    isValid: false,
    errMsg: '한 끼 목표 탄수화물을 입력해주세요',
  },
  proteinChange: {
    value: '',
    isValid: false,
    errMsg: '한 끼 목표 단백질을 입력해주세요',
  },
  fatChange: {
    value: '',
    isValid: false,
    errMsg: '한 끼 목표 지방을 입력해주세요',
  },
  weightChange: {
    value: '',
    isValid: false,
    errMsg: '몸무게를 입력해주세요',
  },

  // Order input
  buyerName: {
    value: '',
    isValid: false,
    errMsg: '이름을 입력해주세요',
  },
  buyerTel: {
    value: '',
    isValid: false,
    errMsg: '연락처를 입력해주세요',
  },
  addr1: {
    value: '',
    isValid: false,
    errMsg: '주소를 입력해주세요',
  },
  addr2: {
    value: '',
    isValid: false,
    errMsg: '상세주소를 입력해주세요',
  },
  zipCode: {
    value: '',
    isValid: false,
    errMsg: '우편번호를 입력해주세요',
  },
  entranceType: {
    value: ENTRANCE_TYPE[0],
    isValid: true,
    errMsg: '',
  },
  entranceNote: {
    value: '',
    isValid: true,
    errMsg: '',
  },
  paymentMethod: {
    value: 'kakao',
    isValid: true,
    errMsg: '',
  },
};

const userInputSlice = createSlice({
  name: 'userInput',
  initialState,
  reducers: {
    initializeInput: state => {
      Object.assign(state, initialState);
    },
    loadBaseLineData: (state, action: PayloadAction<IBaseLineData>) => {
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
      // Mypage calorie, carb, protein, fat change input
      state.calorieChange.value = String(parseInt(action.payload.calorie));
      state.calorieChange.isValid = true;
      state.calorieChange.errMsg = '';
      state.carbChange.value = String(parseInt(action.payload.carb));
      state.carbChange.isValid = true;
      state.carbChange.errMsg = '';
      state.proteinChange.value = String(parseInt(action.payload.protein));
      state.proteinChange.isValid = true;
      state.proteinChange.errMsg = '';
      state.fatChange.value = String(parseInt(action.payload.fat));
      state.fatChange.isValid = true;
      state.fatChange.errMsg = '';
      state.weightChange.value = action.payload.weight;
      state.weightChange.isValid = true;
      state.weightChange.errMsg = '';
    },
    loadAddressData: (state, action: PayloadAction<IAddressCreate>) => {
      state.addr1.value = action.payload.addr1;
      state.addr2.value = action.payload.addr2;
      state.zipCode.value = action.payload.zipCode;
      state.addr1.isValid = state.addr1.value ? true : false;
      state.addr2.isValid = true;
      state.zipCode.isValid = state.zipCode.value ? true : false;
    },
    setValue: (
      state,
      action: PayloadAction<{
        name: keyof UserInputState;
        value: UserInputState[keyof UserInputState]['value'];
      }>,
    ) => {
      const name = action.payload.name;
      // 핸드폰 번호 input은 입력시 자동으로 하이픈 추가
      const value =
        name === 'buyerTel'
          ? formatPhone(action.payload.value)
          : action.payload.value;

      // value update
      state[name].value = value;

      // 운동 "안함" 선택했을 때는 운동시간, 강도도 첫번째 선택지로
      if (name === 'sportsSeqCd' && value === SPORTS_SEQ_CD[0].cd) {
        state.sportsTimeCd.value = SPORTS_TIME_CD[0].cd;
        state.sportsStrengthCd.value = SPORTS_STRENGTH_CD[0].cd;
      }

      // validation
      if (!validateInput[name]) {
        state[name].isValid = true;
        state[name].errMsg = '';
        return;
      }
      const {errMsg, isValid} = validateInput[name](value);
      state[name].errMsg = errMsg;
      state[name].isValid = isValid;
    },
    setAddrBase: (
      state,
      action: PayloadAction<{zipCode: string; addr1: string}>,
    ) => {
      state.zipCode.value = action.payload.zipCode;
      state.addr1.value = action.payload.addr1;
      state.zipCode.isValid = state.zipCode.value ? true : false;
      state.addr1.isValid = state.addr1.value ? true : false;
      state.addr2.value = '';
    },
  },
});

export const {
  setValue,
  loadBaseLineData,
  initializeInput,
  loadAddressData,
  setAddrBase,
} = userInputSlice.actions;

export default userInputSlice.reducer;

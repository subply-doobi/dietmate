import {Dimensions, Platform} from 'react-native';

// RN constants
export const {width, height} = Dimensions.get('screen');
export const SCREENWIDTH = Math.min(width, height);
export const SCREENHEIGHT = Math.max(width, height);
export const DALERT_WIDTH = SCREENWIDTH - 80;
export const IS_ANDROID = Platform.OS === 'android';
export const IS_IOS = Platform.OS === 'ios';
export const FOOD_LIST_ITEM_HEIGHT = 152;
export const HOME_FILTER_HEADER_HEIGHT = 120;

// service constants
export const SHIPPING_PRICE = 4000;
export const FREE_SHIPPING_PRICE = 30000;

// Doobi server category etc.

//주간 운동 횟수
export const WORKOUT_PURPOSE_CD = [
  {label: '안함', value: 'SP008001'},
  {label: '1회', value: 'SP008002'},
  {label: '2회', value: 'SP008003'},
  {label: '3회', value: 'SP008004'},
  {label: '4회', value: 'SP008005'},
  {label: '5회', value: 'SP008006'},
  {label: '6회', value: 'SP008007'},
  {label: '으악그만', value: 'SP008008'},
];

//회당 운동 시간(분)
export const WORKOUT_FREQUENCY_CD = [
  {label: '30분 이하', value: 'SP009001'},
  {label: '60분 이하', value: 'SP009002'},
  {label: '90분 이하', value: 'SP009003'},
  {label: '120분 이하', value: 'SP009004'},
  {label: '으악그만', value: 'SP009005'},
];

//운동 강도(누가 뭐래도 내 느낌)
export const WORKOUT_INTENSITY_CD = [
  {label: '이정도면 잠들기도 가능', value: 'SP010001'},
  {label: '적당한 산책 느낌', value: 'SP010002'},
  {label: '숨이 가쁘지만 버틸 만한 정도', value: 'SP010003'},
  {label: '중간중간 쉬지 않으면 못버틴다', value: 'SP010004'},
  {label: '유언장이 준비되어 있다', value: 'SP010005'},
];
export const DIET_PURPOSE_CD = {
  1: 'SP002001',
  2: 'SP002002',
  3: 'SP002003',
  4: 'SP002004',
  5: 'SP002005',
};
export const purposeCategory = [
  {label: '다이어트(한 달 1~2kg감량)', value: 'SP002001'},
  {label: '다이어트(한 달 3~4kg감량)', value: 'SP002002'},
  {label: '체중유지', value: 'SP002003'},
  {label: '체중증가(한 달 1~2kg증량) ', value: 'SP002004'},
  {label: '체중증가(한 달 3~4kg증량)', value: 'SP002005'},
];
export const weightTrainingCategrory = [
  {label: '하루 30분 이하', value: 'SP003001'},
  {label: '하루 30분~1시간 이하', value: 'SP003002'},
  {label: '하루 1시간~1시간30분이하', value: 'SP003003'},
  {label: '하루 1시간30분~2시간 이하', value: 'SP003004'},
  {label: '하루 2시간 이상', value: 'SP003005'},
];
export const aerobicTrainingCategrory = [
  {label: '하루 30분 이하', value: 'SP004001'},
  {label: '하루 30분~1시간 이하', value: 'SP004002'},
  {label: '하루 1시간~1시간30분이하', value: 'SP004003'},
  {label: '하루 1시간30분~2시간 이하', value: 'SP004004'},
  {label: '하루 2시간 이상', value: 'SP004005'},
];
export const nutrRatioCategory = [
  {label: '55 : 20 : 25(보건복지부 권장)', value: 'SP005001'},
  {label: '20 : 20: 60(저탄고지 식단)', value: 'SP005002'},
  {label: '40 : 40 : 20(벌크업용)', value: 'SP005003'},
];
// consts for screens
export const myPageBtns = [
  {title: '몸무게변경', btnId: 'ChangeWeight'},
  {title: '찜한식품', btnId: 'Likes'},
  {title: '주문내역', btnId: 'PaymentHistory'},
  {title: '계정설정', btnId: 'Account'},
];

export const categoryCode: {[key: string]: string} = {
  도시락: 'CG001',
  닭가슴살: 'CG002',
  샐러드: 'CG003',
  영양간식: 'CG004',
  과자: 'CG005',
  음료: 'CG006',
};

interface INutrErrorRange {
  [key: string]: [number, number];
}
export const NUTR_ERROR_RANGE: INutrErrorRange = {
  calorie: [-50, 50],
  carb: [-15, 15],
  protein: [-5, 5],
  fat: [-3, 3],
};

export const filterBtnRange = [
  {
    label: '칼로리 (kcal)',
    value: [
      [0, 100],
      [100, 200],
      [200, 300],
      [300, 460],
    ],
  },
  {
    label: '탄수화물 (g)',
    value: [
      [0, 20],
      [20, 40],
      [40, 60],
      [60, 80],
    ],
  },
  {
    label: '단백질 (g)',
    value: [
      [0, 10],
      [10, 20],
      [20, 30],
      [30, 42],
    ],
  },
  {
    label: '지방 (g)',
    value: [
      [0, 5],
      [5, 10],
      [10, 15],
      [15, 20],
    ],
  },
];

interface ITimeToMinutes {
  [key: string]: number;
}
export const timeCdToMinutes: ITimeToMinutes = {
  SP003001: 0,
  SP003002: 30,
  SP003003: 60,
  SP003004: 90,
  SP003005: 120,
  SP004001: 0,
  SP004002: 30,
  SP004003: 60,
  SP004004: 90,
  SP004005: 120,
};
interface IPurposeToCalorie {
  [key: string]: {
    targetText: string;
    additionalCalorieText: string;
    additionalCalorie: string;
  };
}
export const purposeCdToValue: IPurposeToCalorie = {
  SP002001: {
    targetText: '한 달 1~2kg 감량',
    additionalCalorieText: '-500kcal',
    additionalCalorie: '-500',
  },
  SP002002: {
    targetText: '한 달 3~4kg 감량',
    additionalCalorieText: '-700kcal',
    additionalCalorie: '-700',
  },
  SP002003: {
    targetText: '체중 유지',
    additionalCalorieText: '0kcal',
    additionalCalorie: '0',
  },
  SP002004: {
    targetText: '한 달 1~2kg 증량',
    additionalCalorieText: '500kcal',
    additionalCalorie: '500',
  },
  SP002005: {
    targetText: '한 달 3~4kg 증량',
    additionalCalorieText: '700kcal',
    additionalCalorie: '700',
  },
};

interface IRatioCdValue {
  [key: string]: {
    carbRatio: string;
    proteinRatio: string;
    fatRatio: string;
  };
}
export const ratioCdToValue: IRatioCdValue = {
  SP005001: {
    carbRatio: '0.55',
    proteinRatio: '0.2',
    fatRatio: '0.25',
  },
  SP005002: {
    carbRatio: '0.2',
    proteinRatio: '0.2',
    fatRatio: '0.6',
  },
  SP005003: {
    carbRatio: '0.4',
    proteinRatio: '0.4',
    fatRatio: '0.2',
  },
};

// validationRules
interface IValidationRules {
  [key: string]: {
    [key: string]: any;
  };
}
const regex = /^[ㄱ-ㅎ|가-힣]+$/; //문자열에 한글만 있는지 확인

export const validationRules: IValidationRules = {
  age: {
    required: '필수 정보입니다',
    maxLength: 3,
    validate: {
      range: (v: string) =>
        (parseInt(v) >= 10 && parseInt(v) <= 100) ||
        '10~100세 안으로 입력해주세요',
    },
  },
  orderer: {
    required: '필수 정보입니다',
    // validate: {
    // isValid: v => regex.test(v) || '한글로 입력',
    // },
  },
  ordererContact: {
    required: '필수 정보입니다',
  },
  height: {
    required: '필수 정보입니다',
    maxLength: 3,
    validate: {
      range: (v: string) =>
        (parseFloat(v) >= 120 && parseFloat(v) <= 230) ||
        '정확한 신장을 입력해주세요',
    },
  },
  weight: {
    required: '필수 정보입니다',
    maxLength: 3,
    validate: {
      range: (v: string) =>
        (parseInt(v) >= 30 && parseInt(v) <= 130) ||
        '정확한 몸무게를 입력해주세요',
    },
  },
  bmrKnown: {
    maxlength: 4,
    validate: {
      range: (v: string) =>
        (parseFloat(v) >= 500 && parseFloat(v) <= 3000) ||
        v === '' ||
        '정확한 기초대사량을 입력해주세요',
    },
  },
  caloriePerMeal: {
    maxlength: 4,
    validate: {
      range: (v: string) =>
        (parseFloat(v) >= 300 && parseFloat(v) <= 1400) ||
        '300~1400 kcal 사이로 입력해주세요',
    },
  },
  carbManual: {
    maxlength: 3,
    validate: {
      range: (v: string) =>
        !v
          ? '탄수화물 양을 입력해주세요'
          : (parseFloat(v) >= 10 && parseFloat(v) <= 375) ||
            `한 끼에 ${v}g은 안돼요 ㅠㅠ`,
    },
  },
  proteinManual: {
    maxlength: 3,
    validate: {
      range: (v: string) =>
        !v
          ? '단백질 양을 입력해주세요'
          : (parseFloat(v) >= 10 && parseFloat(v) <= 375) ||
            `한 끼에 ${v}g은 안돼요 ㅠㅠ`,
    },
  },
  fatManual: {
    maxlength: 3,
    validate: {
      range: (v: string) =>
        !v
          ? '지방 양을 입력해주세요'
          : (parseFloat(v) >= 5 && parseFloat(v) <= 100) ||
            `한 끼에 ${v}g은 안돼요 ㅠㅠ`,
    },
  },
};

// bootpay consts
export const kakaoAppAdminKey = 'f1fddabbeb50a2054c9b82ced4017b11';

// type
export interface NavigationProps {
  navigation?: {
    navigate: Function;
    goBack: Function;
    setOptions: Function;
    reset: Function;
  };
  route?: any;
}

export interface IFormField {
  field: {
    onChange: () => void;
    onBlur: () => void;
    value: string;
  };
}

import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {IProductData} from '../../shared/api/types/product';

type ITutorialProgress =
  | ''
  | 'AddMenu'
  | 'AddFood'
  | 'SelectFood'
  | 'AutoRemain'
  | 'ChangeFood'
  | 'AutoMenu'
  | 'Complete';
export interface ICartState {
  currentDietNo: string;
  totalFoodList: IProductData[];
  totalFoodListIsLoaded: boolean;
  platformDDItems: {value: string; label: string}[];
  progressTooltipShow: boolean;
  menuAcActive: number[];
  isTutorialMode: boolean;
  tutorialProgress: ITutorialProgress;
  autoMenuStatus: {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
}

const initialState: ICartState = {
  currentDietNo: '',
  totalFoodList: [],
  totalFoodListIsLoaded: false,
  platformDDItems: [{value: '', label: '선택안함'}],
  progressTooltipShow: true,
  menuAcActive: [],
  isTutorialMode: false,
  tutorialProgress: '',
  autoMenuStatus: {
    isLoading: false,
    isSuccess: false,
    isError: false,
  },
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setCurrentDiet: (state, action: PayloadAction<string>) => {
      state.currentDietNo = action.payload;
      state.progressTooltipShow = true;
      // queryClient.invalidateQueries([PRODUCTS]);
    },
    setTotalFoodList: (state, action: PayloadAction<IProductData[]>) => {
      state.totalFoodList = action.payload;
      state.totalFoodListIsLoaded = true;

      // action.payload 의 platformNm을 기준으로 중복되지 않는 platformNm을 platformDDItems 형태의 배열로 만들기
      const platformNmSet = new Set(
        action.payload.map(product => product.platformNm),
      );
      const platformNmArr = Array.from(platformNmSet);
      const platformDDItems = platformNmArr.map(platformNm => ({
        value: platformNm,
        label: platformNm,
      }));
      state.platformDDItems = [
        ...[{value: '', label: '선택안함'}],
        ...platformDDItems,
      ];
    },
    setProgressTooltipShow: (state, action: PayloadAction<boolean>) => {
      state.progressTooltipShow = action.payload;
    },
    setMenuAcActive: (state, action: PayloadAction<number[]>) => {
      state.menuAcActive = action.payload;
    },
    setIsTutorialMode: (state, action: PayloadAction<boolean>) => {
      state.isTutorialMode = action.payload;
    },
    setTutorialProgress: (state, action: PayloadAction<ITutorialProgress>) => {
      state.tutorialProgress = action.payload;
    },
    setTutorialStart: state => {
      state.isTutorialMode = true;
      state.tutorialProgress = 'AddMenu';
    },
    setTutorialEnd: state => {
      state.isTutorialMode = false;
      state.tutorialProgress = '';
    },
    setAutoMenuStatus: (
      state,
      action: PayloadAction<{
        isLoading?: boolean;
        isSuccess?: boolean;
        isError?: boolean;
      }>,
    ) => {
      state.autoMenuStatus = {...state.autoMenuStatus, ...action.payload};
    },
  },
});

export const {
  setCurrentDiet,
  setTotalFoodList,
  setProgressTooltipShow,
  setMenuAcActive,
  setIsTutorialMode,
  setTutorialStart,
  setTutorialEnd,
  setTutorialProgress,
  setAutoMenuStatus,
} = commonSlice.actions;
export default commonSlice.reducer;

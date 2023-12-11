import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {IProductData} from '../../query/types/product';

export interface ICartState {
  currentDietNo: string;
  totalFoodList: IProductData[];
  totalFoodListIsLoaded: boolean;
  platformDDItems: {value: string; label: string}[];
  nutrTooltipText: string;
  menuActiveSection: number[];
}

const initialState: ICartState = {
  currentDietNo: '',
  totalFoodList: [],
  totalFoodListIsLoaded: false,
  platformDDItems: [{value: '', label: '선택안함'}],
  nutrTooltipText: '',
  menuActiveSection: [],
};

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setCurrentDiet: (state, action: PayloadAction<string>) => {
      state.currentDietNo = action.payload;
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
    setNutrTooltipText: (state, action: PayloadAction<string>) => {
      state.nutrTooltipText = action.payload;
    },
    setMenuActiveSection: (state, action: PayloadAction<number[]>) => {
      state.menuActiveSection = action.payload;
    },
  },
});

export const {
  setCurrentDiet,
  setTotalFoodList,
  setNutrTooltipText,
  setMenuActiveSection,
} = commonSlice.actions;
export default commonSlice.reducer;

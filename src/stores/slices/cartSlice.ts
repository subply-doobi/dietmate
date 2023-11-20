import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {IProductData} from '../../query/types/product';

export interface ICartState {
  currentDietNo: string;
  totalFoodList: IProductData[];
  totalFoodListIsLoaded: boolean;
  nutrTooltipText: string;
  menuActiveSection: number[];
}

const initialState: ICartState = {
  currentDietNo: '',
  totalFoodList: [],
  totalFoodListIsLoaded: false,
  nutrTooltipText: '',
  menuActiveSection: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCurrentDiet: (state, action: PayloadAction<string>) => {
      state.currentDietNo = action.payload;
      // queryClient.invalidateQueries([PRODUCTS]);
    },
    setTotalFoodList: (state, action: PayloadAction<IProductData[]>) => {
      state.totalFoodList = action.payload;
      state.totalFoodListIsLoaded = true;
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
} = cartSlice.actions;
export default cartSlice.reducer;

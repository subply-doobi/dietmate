import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {IProductsData} from '../../query/types/product';

export interface ICartState {
  currentDietNo: string;
  totalFoodList: IProductsData;
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
    setTotalFoodList: (state, action: PayloadAction<IProductsData>) => {
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

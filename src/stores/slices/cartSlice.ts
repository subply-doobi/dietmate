import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {IProductsData} from '../../query/types/product';

export interface ICartState {
  currentDietNo: string;
  totalFoodList: IProductsData;
  totalFoodListIsLoaded: boolean;
  nutrTooltipText: string;
}

const initialState: ICartState = {
  currentDietNo: '',
  totalFoodList: [],
  totalFoodListIsLoaded: false,
  nutrTooltipText: '',
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
  },
});

export const {setCurrentDiet, setTotalFoodList, setNutrTooltipText} =
  cartSlice.actions;
export default cartSlice.reducer;

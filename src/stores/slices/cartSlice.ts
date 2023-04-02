import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

import {queryClient} from '../../query/store';
import {PRODUCTS} from '../../query/keys';
import {IProductsData} from '../../query/types/product';

export interface ICartState {
  currentDietNo: string;
  totalFoodList: IProductsData;
  totalFoodListIsLoaded: boolean;
}

const initialState: ICartState = {
  currentDietNo: '',
  totalFoodList: [],
  totalFoodListIsLoaded: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCurrentDiet: (state, action: PayloadAction<string>) => {
      state.currentDietNo = action.payload;
      queryClient.invalidateQueries([PRODUCTS]);
    },
    setTotalFoodList: (state, action: PayloadAction<IProductsData>) => {
      state.totalFoodList = action.payload;
      state.totalFoodListIsLoaded = true;
    },
  },
});

export const {setCurrentDiet, setTotalFoodList} = cartSlice.actions;
export default cartSlice.reducer;

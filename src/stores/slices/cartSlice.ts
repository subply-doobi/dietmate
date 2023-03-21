import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {queryClient} from '../../query/store';
import {PRODUCT} from '../../query/keys';

// cart -> menu -> product

interface ICurrentNutr {
  cal: number;
  carb: number;
  protein: number;
  fat: number;
}
export interface ICartState {
  currentDietNo: string;
  currentNutr: ICurrentNutr;
}

const initialState: ICartState = {
  currentDietNo: '',
  currentNutr: {
    cal: 0,
    carb: 0,
    protein: 0,
    fat: 0,
  },
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCurrentDietNo: (state, action: PayloadAction<string>) => {
      state.currentDietNo = action.payload;
      queryClient.invalidateQueries([PRODUCT]);
    },
  },
});

export const {setCurrentDietNo} = cartSlice.actions;
export default cartSlice.reducer;

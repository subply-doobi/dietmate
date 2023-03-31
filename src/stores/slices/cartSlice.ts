import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

import {queryClient} from '../../query/store';
import {DIET, PRODUCT} from '../../query/keys';
import {IDietData} from '../../query/types/diet';
import {findDietSeq} from '../../util/findDietSeq';

export interface ICartState {
  currentDietNo: string;
  currentDietIdx: number;
}

const initialState: ICartState = {
  currentDietNo: '',
  currentDietIdx: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCurrentDiet: (state, action: PayloadAction<string>) => {
      state.currentDietNo = action.payload;
      queryClient.invalidateQueries([PRODUCT]);
    },
  },
});

export const {setCurrentDiet} = cartSlice.actions;
export default cartSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {queryClient} from '../../query/store';
import {DIET_DETAIL_EMPTY_YN, PRODUCT} from '../../query/keys';

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
    // setCurrentNutr: (state, action: PayloadAction<ICurrentNutr>) => {
    //   const {cal, carb, protein, fat} = state.currentNutr;
    //   state.currentNutr = {
    //     cal: action.payload.cal,
    //     carb: action.payload.carb,
    //     protein: action.payload.protein,
    //     fat: action.payload.fat,
    //   };
    // },
    // addNutr: (state, action: PayloadAction<ICurrentNutr>) => {
    //   const {cal, carb, protein, fat} = state.currentNutr;
    //   state.currentNutr = {
    //     cal: cal + action.payload.cal,
    //     carb: carb + action.payload.carb,
    //     protein: protein + action.payload.protein,
    //     fat: fat + action.payload.fat,
    //   };
    // },
    // minusNutr: (state, action: PayloadAction<ICurrentNutr>) => {
    //   const {cal, carb, protein, fat} = state.currentNutr;
    //   state.currentNutr = {
    //     cal: cal - action.payload.cal,
    //     carb: carb - action.payload.carb,
    //     protein: protein - action.payload.protein,
    //     fat: fat - action.payload.fat,
    //   };
    // },
  },
});

export const {setCurrentDietNo} = cartSlice.actions;
export default cartSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface IHomeState {
  homeTooltipShow: boolean;
}

const initialState: IHomeState = {
  homeTooltipShow: true,
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setHomeTooltipShow: (state, action: PayloadAction<boolean>) => {
      state.homeTooltipShow = action.payload;
    },
  },
});

export const {setHomeTooltipShow} = homeSlice.actions;
export default homeSlice.reducer;

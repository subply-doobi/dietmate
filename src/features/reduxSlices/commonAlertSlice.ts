import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface ICommonAlert {
  errorCode: number | undefined;
}

const initialState: ICommonAlert = {
  errorCode: undefined,
};

export const commonAlertSlice = createSlice({
  name: 'commonAlert',
  initialState,
  reducers: {
    openCommonAlert: (state, action: PayloadAction<number>) => {
      state.errorCode = action.payload;
    },
    closeCommonAlert: state => {
      state.errorCode = undefined;
    },
  },
});

export const {openCommonAlert, closeCommonAlert} = commonAlertSlice.actions;
export default commonAlertSlice.reducer;

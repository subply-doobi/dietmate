import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

interface ICommonAlertSlice {
  message: string;
}

const initialState: ICommonAlertSlice = {
  message: '',
};

export const commonAlertSlice = createSlice({
  name: 'commonAlert',
  initialState,
  reducers: {
    openCommonAlert: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    closeCommonAlert: state => {
      state.message = '';
    },
  },
});

export const {openCommonAlert, closeCommonAlert} = commonAlertSlice.actions;
export default commonAlertSlice.reducer;

import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface IErrorAlert {
  errorCode: number | undefined | null;
  msg: string;
}

const initialState: IErrorAlert = {
  errorCode: null,
  msg: '',
};

export const errorAlertSlice = createSlice({
  name: 'errorAlert',
  initialState,
  reducers: {
    openErrorAlert: (state, action: PayloadAction<IErrorAlert>) => {
      state.errorCode = action.payload.errorCode;
      state.msg = action.payload.msg;
    },
    closeErrorAlert: state => {
      state.errorCode = undefined;
      state.msg = '';
    },
  },
});

export const {openErrorAlert, closeErrorAlert} = errorAlertSlice.actions;
export default errorAlertSlice.reducer;

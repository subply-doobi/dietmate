import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

import {IDietDetailData} from '../../query/types/diet';

interface IOrderState {
  // 제조사별 식품리스트
  foodToOrder: IDietDetailData[];
  selectedAddrIdx: number;
}

const initialState: IOrderState = {
  foodToOrder: [[]],
  selectedAddrIdx: 0,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // foodToOrder
    setFoodToOrder: (state, action: PayloadAction<IDietDetailData[]>) => {
      state.foodToOrder = action.payload;
    },
    setselectedAddrIdx: (state, action: PayloadAction<number>) => {
      state.selectedAddrIdx = action.payload;
    },
  },
});

export const {setFoodToOrder, setselectedAddrIdx} = orderSlice.actions;
export default orderSlice.reducer;

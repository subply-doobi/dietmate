import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

import {IDietDetailData} from '../../query/types/diet';

interface IAddress {
  postalCode: string;
  base: string;
  detail: string;
}

interface IOrderState {
  // 제조사별 식품리스트
  orderInfo: {
    foodToOrder: IDietDetailData[];
    orderer: string;
    ordererContact: string;
    address: Array<IAddress>;
    receiver: string;
    receiverContact: string;
    paymentMethod: string;
  };
  orderSummary: {
    foodPrice: number;
    shippingFee: number;
    tid: string;
    pgToken: string;
  };
  selectedAddressId: number;
}

const initialState: IOrderState = {
  orderInfo: {
    foodToOrder: [[]],
    orderer: '',
    ordererContact: '',
    address: [],
    receiver: '',
    receiverContact: '',
    paymentMethod: '',
  },
  orderSummary: {
    foodPrice: 0,
    shippingFee: 0,
    tid: '',
    pgToken: '',
  },
  selectedAddressId: 0,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // foodToOrder
    setFoodToOrder: (state, action: PayloadAction<IDietDetailData[]>) => {
      state.orderInfo.foodToOrder = action.payload;
    },

    // orderer
    setOrderer: (
      state,
      action: PayloadAction<{orderer: string; ordererContact: string}>,
    ) => {
      state.orderInfo.orderer = action.payload.orderer;
      state.orderInfo.ordererContact = action.payload.ordererContact;
    },

    // address
    addAddress: (
      state,
      action: PayloadAction<{
        postalCode: string;
        base: string;
        detail: string;
      }>,
    ) => {
      state.orderInfo.address.push(action.payload);
    },
    deleteAddress: (state, action: PayloadAction<number>) => {
      state.orderInfo.address.splice(action.payload, 1);
    },
    updateAddress: (
      state,
      action: PayloadAction<{
        address: {
          postalCode: string;
          base: string;
          detail: string;
        };
        currentAddressId: number;
      }>,
    ) => {
      console.log('orderSlice: updateAddress!');
      state.orderInfo.address.splice(action.payload.currentAddressId, 1, {
        ...action.payload.address,
      });
    },

    // receiver
    setReceiver: (
      state,
      action: PayloadAction<{receiver: string; receiverContact: string}>,
    ) => {
      state.orderInfo.receiver = action.payload.receiver;
      state.orderInfo.receiverContact = action.payload.receiverContact;
    },

    // orderSummary
    setOrderSummary: (
      state,
      action: PayloadAction<{
        foodPrice?: number;
        shippingFee?: number;
        tid?: string;
        pgToken?: string;
      }>,
    ) => {
      state.orderSummary = {
        ...state.orderSummary,
        ...action.payload,
      };
    },
    setSelectedAddressId: (state, action: PayloadAction<number>) => {
      state.selectedAddressId = action.payload;
    },
  },
});

export const {
  setFoodToOrder,
  setOrderer,
  addAddress,
  updateAddress,
  deleteAddress,
  setReceiver,
  setOrderSummary,
  setSelectedAddressId,
} = orderSlice.actions;
export default orderSlice.reducer;

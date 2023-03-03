import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {getProductIndex, hasProduct} from '../../util/reduxUtil';
import {IProduct} from '../../constants/constants';

// cart -> menu -> product
export interface ICartState {
  menuIndex: number;
  currentDietNo: string;
}

const initialState: ICartState = {
  menuIndex: 0,
  currentDietNo: '',
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setMenuIndex: (state, action: PayloadAction<number>) => {
      state.menuIndex = action.payload;
    },
    setCurrentDietNo: (state, action: PayloadAction<string>) => {
      console.log('cartSlice: setCurrentDietNo!!');
      state.currentDietNo = action.payload;
    },
    addProductToMenu: (
      state,
      action: PayloadAction<{
        menuIndex: number;
        product: IProduct;
      }>,
    ) => {
      const {menuIndex, product} = action.payload;
      hasProduct(state.cart[menuIndex], product.productNo) ||
        state.cart[menuIndex].push(product);
    },
    deleteProduct: (
      state,
      action: PayloadAction<{
        menuIndex: number;
        productNo: string;
      }>,
    ) => {
      const {menuIndex, productNo} = action.payload;
      if (hasProduct(state.cart[menuIndex], productNo)) {
        const productIndex = getProductIndex(state.cart[menuIndex], productNo);
        console.log('deleteProduct: index:', productIndex);
        state.cart[menuIndex].splice(productIndex, 1);
      }
    },
    checkBoxDeleteProduct: (state, action) => {
      const {menuIndex, pickedCart} = action.payload;
      console.log('action:', action.payload);
      pickedCart.map(el => {
        if (hasProduct(state.cart[menuIndex], el)) {
          const productIndex = getProductIndex(state.cart[menuIndex], el);
          console.log('deleteProduct: index:', productIndex);
          return state.cart[menuIndex].splice(productIndex, 1);
        }
      });
    },
    addMenuToCart: state => {
      state.cart = [...state.cart, []];
    },
    deleteMenu: (state, action: PayloadAction<number>) => {
      state.cart.splice(action.payload, 1);
    },
    makeQuantity: (state, action) => {
      let {product} = action.payload;
      state.cart[state.menuIndex].map(el => {
        return (el.qty = 1);
      });
    },
    plusProductQuantity: (state, action) => {
      let {productNo, qty} = action.payload;
      state.cart[state.menuIndex].map(el => {
        if (el.productNo === productNo) {
          qty++;
          return (el.qty = qty);
        }
      });
    },
    minusProductQuantity: (state, action) => {
      let {productNo, qty} = action.payload;
      state.cart[state.menuIndex].map(el => {
        if (el.productNo === productNo) {
          qty--;
          return (el.qty = qty);
        }
      });
    },
    pickProductCheckBox: (state, action) => {
      let {id, picked} = action.payload;

      if (picked === true) {
        state.pickedCart.push(id);
      } else if (picked === false) {
        for (let i = 0; i < state.pickedCart.length; i++) {
          if (state.pickedCart[i] === id) {
            state.pickedCart.splice(i, 1);
            i--;
          }
        }
      }
    },
  },
});

export const {
  setMenuIndex,
  setCurrentDietNo,
  addProductToMenu,
  deleteProduct,
  addMenuToCart,
  deleteMenu,
  plusProductQuantity,
  minusProductQuantity,
  makeQuantity,
  pickProductCheckBox,
  checkBoxDeleteProduct,
} = cartSlice.actions;
export default cartSlice.reducer;

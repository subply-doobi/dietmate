import {configureStore} from '@reduxjs/toolkit';

import userInfoReducer from './slices/userInfoSlice';
import userInputReducer from './slices/userInputSlice';
import sortFilterReducer from './slices/sortFilterSlice';
import cartReducer from './slices/cartSlice';
import likeReducer from './slices/likeSlice';
import orderReducer from './slices/orderSlice';
import commonAlertReducer from './slices/commonAlertSlice';

export const store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    userInput: userInputReducer,
    sortFilter: sortFilterReducer,
    cart: cartReducer,
    like: likeReducer,
    order: orderReducer,
    commonAlert: commonAlertReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

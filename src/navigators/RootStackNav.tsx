import {createNativeStackNavigator} from '@react-navigation/native-stack';
import InputNav from './InputNav';
import BottomTabNav from './BottomTabNav';
import Login from '../screens/Login';
import React from 'react';
import OrderNav from './OrderNav';
import FoodDetail from '../screens/foodDetailScreen/FoodDetail';
import HistoryNav from './HistoryNav';
import PaymentHistoryNav from './PaymentHistoryNav';

const Stack = createNativeStackNavigator();

const RootStackNav = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />

      <Stack.Screen name="InputNav" component={InputNav} />
      <Stack.Screen name="BottomTabNav" component={BottomTabNav} />
      <Stack.Screen name="FoodDetail" component={FoodDetail} />
      <Stack.Screen name="OrderNav" component={OrderNav} />
      <Stack.Screen name="HistoryNav" component={HistoryNav} />
      <Stack.Screen name="PaymentHistoryNav" component={PaymentHistoryNav} />
    </Stack.Navigator>
  );
};

export default RootStackNav;

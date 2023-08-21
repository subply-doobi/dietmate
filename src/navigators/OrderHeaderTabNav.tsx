import {TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {NavigationProps} from '../constants/constants';
import colors from '../styles/colors';

import Order from '../screens/orderScreen/Order';
import SelfOrder from '../screens/orderScreen/SelfOrder';
import AddressEdit from '../screens/orderScreen/AddressEdit';
import BackArrow from '../components/common/BackArrow';
import PaymentComplete from '../screens/orderScreen/PaymentComplete';
import PaymentHistory from '../screens/orderScreen/PaymentHistory';
import {notifyManager} from 'react-query';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const OrderHeaderTabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarIndicatorStyle: {
          backgroundColor: colors.main,
          height: 4,
        },
        tabBarPressColor: colors.white,
      }}>
      <Tab.Screen
        name="Order"
        component={Order}
        options={{
          tabBarLabel: '두비가 도와줘',
          tabBarLabelStyle: {fontSize: 15},
        }}
      />
      <Tab.Screen
        name="SelfOrder"
        component={SelfOrder}
        options={{
          tabBarLabel: '스스로 구매하기',
          tabBarLabelStyle: {fontSize: 15},
        }}
      />
    </Tab.Navigator>
  );
};

export default OrderHeaderTabNav;

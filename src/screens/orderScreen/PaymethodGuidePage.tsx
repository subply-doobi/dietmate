import {TouchableOpacity, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import colors from '../../styles/colors';

import Order from './Order';
import SelfOrder from './SelfOrder';
import OrderNav from '../../navigators/OrderHeaderTabNav';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

const Test = () => {
  return <Text>두비가 도와줘</Text>;
};
const Test2 = () => {
  return <Text>스스로 구매하기</Text>;
};

const OrderHeaderTab = () => {
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
        name="DoobiOrder"
        component={Test}
        options={{
          tabBarLabel: '두비가 도와줘',
          tabBarLabelStyle: {fontSize: 15},
        }}
      />
      <Tab.Screen
        name="SelfOrder"
        component={Test2}
        options={{
          tabBarLabel: '스스로 구매하기',
          tabBarLabelStyle: {fontSize: 15},
        }}
      />
    </Tab.Navigator>
  );
};

const PayMethodGuidePage = () => {
  return (
    <>
      <OrderHeaderTab />
    </>
  );
};
export default PayMethodGuidePage;

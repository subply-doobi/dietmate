import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import colors from '../styles/colors';
import OrderGuide from '../screens/orderScreen/OrderGuide';
import SelfOrderGuide from '../screens/orderScreen/SelfOrderGuide';

const Tab = createMaterialTopTabNavigator();

const OrderGuideHeaderTabNav = () => {
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
        name="OrderGuide"
        component={OrderGuide}
        options={{
          tabBarLabel: '두비가 도와줘',
          tabBarLabelStyle: {fontSize: 15},
        }}
      />
      <Tab.Screen
        name="SelfOrderGuide"
        component={SelfOrderGuide}
        options={{
          tabBarLabel: '스스로 구매하기',
          tabBarLabelStyle: {fontSize: 15},
        }}
      />
    </Tab.Navigator>
  );
};

export default OrderGuideHeaderTabNav;

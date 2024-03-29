import {createNativeStackNavigator} from '@react-navigation/native-stack';

import colors from '../styles/colors';

import OrderHistoryDetail from '../screens/myPageScreen/orderHistory/OrderHistoryDetail';
import OrderHistory from '../screens/myPageScreen/orderHistory/OrderHistory';
import BackArrow from '../components/common/navigation/BackArrow';
import {useNavigation} from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const OrderHistoryNav = () => {
  const {goBack, navigate} = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistory}
        options={{
          headerTitleAlign: 'center',
          headerTitle: '구매내역',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerShadowVisible: false,
          headerLeft: () => <BackArrow goBackFn={goBack} />,
        }}
      />
      <Stack.Screen
        name="OrderHistoryDetail"
        component={OrderHistoryDetail}
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <BackArrow goBackFn={() => navigate('OrderHistory')} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default OrderHistoryNav;

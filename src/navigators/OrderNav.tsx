import {TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {NavigationProps} from '../constants/constants';
import colors from '../styles/colors';

import Order from '../screens/orderScreen/Order';
import AddressEdit from '../screens/orderScreen/AddressEdit';
import BackArrow from '../components/common/BackArrow';
import PaymentComplete from '../screens/orderScreen/PaymentComplete';
import PaymentHistory from '../screens/orderScreen/PaymentHistory';

const Stack = createNativeStackNavigator();

const OrderNav = () => {
  const navigation = useNavigation();
  const {goBack, navigate} = navigation;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Order"
        component={Order}
        options={{
          headerShown: true,
          headerTitle: '주문 / 결제',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerLeft: () => <BackArrow goBackFn={goBack} />,
        }}
      />
      <Stack.Screen
        name="AddressEdit"
        component={AddressEdit}
        options={{
          headerTitle: '배송지 수정',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerLeft: () => (
            <BackArrow
              goBackFn={() =>
                navigate('OrderNav', {
                  screen: 'Order',
                  params: {from: 'AddressEdit'},
                })
              }
            />
          ),
        }}
      />
      <Stack.Screen
        name="PaymentComplete"
        component={PaymentComplete}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistory}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default OrderNav;

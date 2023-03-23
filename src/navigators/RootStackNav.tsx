import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import colors from '../styles/colors';

import InputNav from './InputNav';
import BottomTabNav from './BottomTabNav';
import OrderNav from './OrderNav';
import PaymentHistoryNav from './PaymentHistoryNav';
import HistoryNav from './HistoryNav';

import Login from '../screens/Login';
import FoodDetail from '../screens/foodDetailScreen/FoodDetail';
import BackArrow from '../components/common/BackArrow';

const Stack = createNativeStackNavigator();

const RootStackNav = () => {
  const navigation = useNavigation();
  const {goBack} = navigation;
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />

      <Stack.Screen name="InputNav" component={InputNav} />
      <Stack.Screen name="BottomTabNav" component={BottomTabNav} />
      <Stack.Screen
        name="FoodDetail"
        component={FoodDetail}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerBackVisible: false,
          headerLeft: () => <BackArrow goBackFn={goBack} />,
        }}
      />
      <Stack.Screen name="OrderNav" component={OrderNav} />
      <Stack.Screen name="HistoryNav" component={HistoryNav} />
      <Stack.Screen name="PaymentHistoryNav" component={PaymentHistoryNav} />
    </Stack.Navigator>
  );
};

export default RootStackNav;

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import colors from '../styles/colors';
import {queryClient} from '../query/store';
import {useHandleError} from '../util/handleError';

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
  // react-query defaultOptions
  const handleError = useHandleError();
  queryClient.setDefaultOptions({
    queries: {
      retry: 0,
      staleTime: 30000,
      cacheTime: 5 * 60 * 1000,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      onError: handleError,
    },
    mutations: {
      onError: handleError,
    },
  });

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

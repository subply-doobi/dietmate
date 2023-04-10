import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

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
import {Pressable, Image} from 'react-native';
import {icons} from '../assets/icons/iconSource';

const Stack = createNativeStackNavigator();

const RootStackNav = () => {
  // react-query defaultOptions
  const handleError = useHandleError();
  queryClient.setDefaultOptions({
    queries: {
      retry: 0,
      staleTime: Infinity,
      cacheTime: Infinity,
      // staleTime: 30000,
      // cacheTime: 5 * 60 * 1000,
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
          headerTitle: '',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerLeft: () => <BackArrow goBackFn={goBack} />,
          headerRight: () => {
            return (
              <Pressable onPress={() => navigation.navigate('Cart')}>
                <Image source={icons.cart_36} style={{width: 36, height: 36}} />
              </Pressable>
            );
          },
        }}
      />
      <Stack.Screen name="OrderNav" component={OrderNav} />
      <Stack.Screen name="HistoryNav" component={HistoryNav} />
      <Stack.Screen name="PaymentHistoryNav" component={PaymentHistoryNav} />
    </Stack.Navigator>
  );
};

export default RootStackNav;

const Badge = styled.View`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: ${colors.main};
  position: absolute;
  right: 0px;
  top: 0px;
  justify-content: center;
  align-items: center;
`;
const BadgeText = styled.Text`
  color: ${colors.white};
  font-size: 10px;
`;

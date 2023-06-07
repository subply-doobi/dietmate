import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

import colors from '../styles/colors';
import {queryClient} from '../query/store';
import {useHandleError} from '../util/handleError';

import InputNav from './InputNav';
import BottomTabNav from './BottomTabNav';
import OrderNav from './OrderNav';
import AddressEdit from '../screens/orderScreen/AddressEdit';
import OrderHeaderTab from './OrderNav';
import PaymentHistoryNav from './PaymentHistoryNav';
import HistoryNav from './HistoryNav';

import Guide from '../screens/Guide';
import Login from '../screens/Login';
import FoodDetail from '../screens/foodDetailScreen/FoodDetail';
import BackArrow from '../components/common/BackArrow';
import {Pressable, Image} from 'react-native';
import {icons} from '../assets/icons/iconSource';
import {useDispatch} from 'react-redux';
import {setNutrTooltipText} from '../stores/slices/cartSlice';
import Account from '../screens/Account';
import KakaoPay from '../components/payment/KakaoPay';

const Stack = createNativeStackNavigator();

const RootStackNav = () => {
  // redux
  const dispatch = useDispatch();

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

  const {goBack, navigate} = useNavigation();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* <Stack.Screen
        name="Guide"
        component={Guide}
        options={{headerShown: false}}
      /> */}
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
              <Pressable onPress={() => navigate('Cart')}>
                <Image source={icons.cart_36} style={{width: 36, height: 36}} />
              </Pressable>
            );
          },
        }}
      />
      <Stack.Screen
        name="OrderNav"
        component={OrderHeaderTab}
        options={{
          headerShown: true,
          headerTitle: '주문/결제',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerShadowVisible: false,
          headerLeft: () => <BackArrow goBackFn={goBack} />,
          headerRight: () => {
            return (
              <Pressable onPress={() => console.log('툴팁설명?')}>
                <Image
                  source={icons.question_24}
                  style={{width: 24, height: 24}}
                />
              </Pressable>
            );
          },
        }}
      />
      <Stack.Screen
        name="AddressEdit"
        component={AddressEdit}
        options={{
          headerShown: true,
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
      <Stack.Screen name="KakaoPayNav" component={KakaoPay} />
      <Stack.Screen name="HistoryNav" component={HistoryNav} />
      <Stack.Screen name="PaymentHistoryNav" component={PaymentHistoryNav} />
      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: true,
          headerTitle: '계정 설정',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerShadowVisible: false,
          headerLeft: () => <BackArrow goBackFn={goBack} />,
        }}
      />
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

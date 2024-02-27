import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import colors from '../styles/colors';

import InputNav from './InputNav';
import BottomTabNav from './BottomTabNav';
import AddressEdit from '../screens/orderScreen/AddressEdit';
import OrderHistoryNav from './OrderHistoryNav';

import Guide from '../screens/Guide';
import Login from '../screens/Login';
import FoodDetail from '../screens/FoodDetail';
import Account from '../screens/myPageScreen/Account';
import OrderComplete from '../screens/orderScreen/OrderComplete';
import BackArrow from '../components/common/navigation/BackArrow';
import KakaoPay from '../components/payment/KakaoPay';
import CustomErrorBoundary from '../components/common/error/CustomErrorBoundary';
import {Pressable, Image} from 'react-native';
import {icons} from '../assets/icons/iconSource';
import Notice from '../screens/myPageScreen/Notice';
import Order from '../screens/orderScreen/Order';
import OrderGuide from '../screens/orderScreen/OrderGuide';

const Stack = createNativeStackNavigator();

const RootStackNav = () => {
  const {goBack, navigate} = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: colors.textMain,
        },
        headerShadowVisible: false,
        headerBackVisible: false,
        headerLeft: () => <BackArrow goBackFn={goBack} />,
      }}>
      {/* 로그인 */}
      <Stack.Screen name="Login" component={Login} />

      {/* 가이드 */}
      <Stack.Screen name="Guide" component={Guide} />

      {/* 정보입력 */}
      <Stack.Screen name="InputNav" component={InputNav} />

      {/* 홈 - 마이페이지 - 좋아요 - 장바구니 */}
      <Stack.Screen name="BottomTabNav" component={BottomTabNav} />

      {/* 식품상세 */}
      <Stack.Screen
        name="FoodDetail"
        component={FoodDetail}
        options={{
          headerShown: true,
          headerTitle: '',
          headerRight: () => {
            return (
              <Pressable onPress={() => navigate('Cart')}>
                <Image source={icons.cart_36} style={{width: 36, height: 36}} />
              </Pressable>
            );
          },
        }}
      />

      {/* 주문 */}
      <Stack.Screen
        name="Order"
        component={Order}
        options={{
          headerShown: true,
          headerTitle: '주문 / 결제',
          headerRight: () => {
            return (
              <Pressable
                onPress={() => {
                  navigate('OrderGuide');
                }}>
                <Image
                  source={icons.question_24}
                  style={{width: 24, height: 24}}
                />
              </Pressable>
            );
          },
        }}
      />

      {/* 배송지 수정 */}
      <Stack.Screen
        name="AddressEdit"
        component={AddressEdit}
        options={{
          headerShown: true,
          headerTitle: '배송지 수정',
          headerLeft: () => (
            <BackArrow
              goBackFn={() =>
                navigate('Order', {
                  params: {from: 'AddressEdit'},
                })
              }
            />
          ),
        }}
      />

      {/* 카카오페이 */}
      <Stack.Screen name="KakaoPay" component={KakaoPay} />

      {/* history는 추후 추가 */}
      {/* <Stack.Screen name="HistoryNav" component={HistoryNav} /> */}

      {/* 주문정보 */}
      <Stack.Screen name="OrderHistoryNav" component={OrderHistoryNav} />

      {/* 주문완료 */}
      <Stack.Screen name="OrderComplete" component={OrderComplete} />

      {/* 계정 설정 */}
      <Stack.Screen
        name="Account"
        component={Account}
        options={{
          headerShown: true,
          headerTitle: '계정 설정',
        }}
      />

      {/* 공지사항 */}
      <Stack.Screen
        name="Notice"
        component={Notice}
        options={{
          headerShown: true,
          headerTitle: '공지사항',
        }}
      />

      {/* 주문 가이드 */}
      <Stack.Screen
        name="OrderGuide"
        component={OrderGuide}
        options={{
          headerShown: true,
          headerTitle: '주문 / 배송안내',
        }}
      />

      {/* 에러 */}
      <Stack.Screen
        name="CustomErrorBoundary"
        component={CustomErrorBoundary}
      />
    </Stack.Navigator>
  );
};

export default RootStackNav;

import styled from 'styled-components/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';

import {icons} from '../assets/icons/iconSource';
import colors from '../styles/colors';

import Home from '../screens/homeScreen/Home';
import Mypage from '../screens/Mypage';
import Likes from '../screens/Likes';
import Cart from '../screens/Cart';
import BackArrow from '../components/common/BackArrow';

import {useListDietDetailAll} from '../query/queries/diet';

const Tab = createBottomTabNavigator();

const BottomTabNav = () => {
  // react-query
  const {data: dietDetailAllData} = useListDietDetailAll();
  const navigation = useNavigation();
  const {goBack} = navigation;
  return (
    <Tab.Navigator backBehavior="history">
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) =>
            focused ? (
              <BottomTabIcon source={icons.mainActivated_36} />
            ) : (
              <BottomTabIcon source={icons.main_36} />
            ),
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Mypage"
        component={Mypage}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) =>
            focused ? (
              <BottomTabIcon source={icons.mypageActivated_36} />
            ) : (
              <BottomTabIcon source={icons.mypage_36} />
            ),
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Likes"
        component={Likes}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <BottomTabIcon source={icons.likeActivated_36} />
            ) : (
              <BottomTabIcon source={icons.like_36} />
            ),
          tabBarShowLabel: false,
          headerShown: true,
          headerTitle: '찜한 상품',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerLeft: () => (
            <BackArrow style={{marginLeft: 16}} goBackFn={goBack} />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({focused}) => (
            <CartIcon>
              {focused ? (
                <BottomTabIcon source={icons.cartFilled_36} />
              ) : (
                <BottomTabIcon source={icons.cart_36} />
              )}
              {dietDetailAllData && dietDetailAllData.length !== 0 && (
                <Badge>
                  <BadgeText>{dietDetailAllData.length}</BadgeText>
                </Badge>
              )}
            </CartIcon>
          ),
          tabBarShowLabel: false,
          headerShown: true,
          headerTitle: '장바구니',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerLeft: () => (
            <BackArrow goBackFn={goBack} style={{marginLeft: 16}} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNav;

const BottomTabIcon = styled.Image`
  width: 36px;
  height: 36px;
`;

const CartIcon = styled.View`
  width: 36px;
  height: 36px;
`;

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

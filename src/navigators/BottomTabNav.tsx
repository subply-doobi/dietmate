import {View, Text} from 'react-native';
import React from 'react';
import styled from 'styled-components/native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Mypage from '../screens/Mypage';
import Likes from '../screens/Likes';
import Cart from '../screens/Cart';
import colors from '../styles/colors';
import BackArrow from '../components/common/BackArrow';
import Home from '../screens/homeScreen/Home';
import {NavigationProps} from '../constants/constants';
import {useNavigation} from '@react-navigation/native';
import {useListDietDetailAll} from '../query/queries/diet';

const Tab = createBottomTabNavigator();

const BottomTabNav = props => {
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
              <BottomTabIcon
                source={require('../assets/icons/36_mainPage_selected.png')}
              />
            ) : (
              <BottomTabIcon
                source={require('../assets/icons/36_mainPage.png')}
              />
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
              <BottomTabIcon
                source={require('../assets/icons/36_profilePage_selected.png')}
              />
            ) : (
              <BottomTabIcon
                source={require('../assets/icons/36_profilePage.png')}
              />
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
              <BottomTabIcon
                source={require('../assets/icons/36_likePage_selected.png')}
              />
            ) : (
              <BottomTabIcon
                source={require('../assets/icons/36_likePage.png')}
              />
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
          headerLeft: () => <BackArrow goBackFn={goBack} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({focused}) => (
            <CartIcon>
              {focused ? (
                <BottomTabIcon
                  source={require('../assets/icons/36_cartPage_selected.png')}
                />
              ) : (
                <BottomTabIcon
                  source={require('../assets/icons/36_cartPage.png')}
                />
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
          headerLeft: () => <BackArrow goBackFn={goBack} />,
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

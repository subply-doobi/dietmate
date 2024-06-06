// RN

// 3rd
import styled from 'styled-components/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';

// doobi
import Mypage from '../../screens/mypage/Mypage';
import BackArrow from '../../shared/ui/BackArrow';
import Search from '../../screens/search/Search';

import {icons} from '../../shared/iconSource';
import colors from '../../shared/colors';
import {useListDietTotalObj} from '../../shared/api/queries/diet';
import {Icon} from '../../shared/ui/styledComps';
import Diet from '../../screens/diet/Diet';
import NewHome from '../../screens/home/NewHome';
import {useMemo} from 'react';
import {tfDTOToDDA} from '../../shared/utils/dataTransform';

const Tab = createBottomTabNavigator();

const BottomTabNav = () => {
  // navigation
  const navigation = useNavigation();
  const {goBack} = navigation;

  // react-query
  const {data: dTOData} = useListDietTotalObj();

  // useMemo
  const dietDetailAllData = useMemo(() => {
    const dietDetailAllData = dTOData ? tfDTOToDDA(dTOData) : [];
    return dietDetailAllData;
  }, [dTOData]);

  return (
    <Tab.Navigator
      backBehavior="history"
      screenOptions={{headerShown: false, tabBarShowLabel: false}}>
      <Tab.Screen
        name="NewHome"
        component={NewHome}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              source={focused ? icons.mainActivated_36 : icons.main_36}
              size={36}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              source={focused ? icons.searchActivated_36 : icons.search_36}
              size={36}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Mypage"
        component={Mypage}
        options={{
          headerShown: true,
          headerTitle: '마이페이지',
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          tabBarIcon: ({focused}) => (
            <Icon
              source={focused ? icons.mypageActivated_36 : icons.mypage_36}
              size={36}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Diet"
        component={Diet}
        options={{
          tabBarIcon: ({focused}) => (
            <CartIcon>
              <Icon
                source={focused ? icons.cartActivated_36 : icons.cart_36}
                size={36}
              />
              {dietDetailAllData.length !== 0 && (
                <Badge>
                  <BadgeText>{dietDetailAllData.length}</BadgeText>
                </Badge>
              )}
            </CartIcon>
          ),
          tabBarShowLabel: false,
          headerShown: true,
          headerTitle: '식단구성',
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

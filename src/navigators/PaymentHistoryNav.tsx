import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PaymentDetail from '../screens/PaymentDetail';
import PaymentHistory from '../screens/orderScreen/PaymentHistory';
import BackArrow from '../components/common/BackArrow';
import {NavigationProps} from '../constants/constants';
import colors from '../styles/colors';

const Stack = createNativeStackNavigator();

const PaymentHistoryNav = ({navigation: {navigate}}: NavigationProps) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PaymentHistory"
        component={PaymentHistory}
        options={{
          headerTitleAlign: 'center',
          headerTitle: '구매내역',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <BackArrow
              goBackFn={() => navigate('BottomTabNav', {screen: 'Mypage'})}
            />
          ),
        }}
      />
      <Stack.Screen
        name="PaymentDetail"
        component={PaymentDetail}
        options={{
          headerTitleAlign: 'center',
          headerTitle: '',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <BackArrow goBackFn={() => navigate('PaymentHistory')} />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default PaymentHistoryNav;

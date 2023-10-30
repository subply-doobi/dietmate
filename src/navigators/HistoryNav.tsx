import {createNativeStackNavigator} from '@react-navigation/native-stack';

import colors from '../styles/colors';
import {NavigationProps} from '../constants/constants';

import History from '../screens/myPageScreen/history/History';
import HistoryDetail from '../screens/myPageScreen/history/HistoryDetail';
import BackArrow from '../components/common/navigation/BackArrow';

const Stack = createNativeStackNavigator();
const HistoryNav = ({navigation: {navigate, goBack}}: NavigationProps) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="History"
        component={History}
        options={{
          headerShown: true,
          headerTitle: '내 기록',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerLeft: () => (
            <BackArrow
              goBackFn={() => navigate('BottomTabNav', {screen: 'Mypage'})}
            />
          ),
        }}
      />
      <Stack.Screen
        name="HistoryDetail"
        component={HistoryDetail}
        options={{
          headerShown: true,
          headerTitle: '',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textMain,
          },
          headerLeft: () => (
            <BackArrow
              goBackFn={() => navigate('HistoryNav', {screen: 'History'})}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default HistoryNav;

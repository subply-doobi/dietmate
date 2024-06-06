import {createNativeStackNavigator} from '@react-navigation/native-stack';

import colors from '../../shared/colors';

import History from '../../screens/myPageScreen/history/History';
import HistoryDetail from '../../screens/myPageScreen/history/HistoryDetail';
import BackArrow from '../../shared/ui/BackArrow';
import {useNavigation} from '@react-navigation/native';

const Stack = createNativeStackNavigator();
const HistoryNav = () => {
  const {navigate} = useNavigation();
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

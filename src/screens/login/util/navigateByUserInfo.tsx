import {NavigationProp} from '@react-navigation/native';
import {IBaseLineData} from '../../../shared/api/types/baseLine';

export const navigateByUserInfo = async (
  data: IBaseLineData | any,
  navigation: NavigationProp<any>,
) => {
  const hasBaseLine = Object.keys(data).length === 0 ? false : true;
  if (!hasBaseLine) {
    // baseline 없으면 UserInput으로
    navigation.navigate('UserInput');
    return;
  }
  // baseline 있으면 홈으로
  navigation.reset({
    index: 0,
    routes: [{name: 'BottomTabNav', params: {screen: 'NewHome'}}],
  });
};

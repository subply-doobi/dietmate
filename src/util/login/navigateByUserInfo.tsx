import {NavigationProp} from '@react-navigation/native';
import {IBaseLineData} from '../../query/types/baseLine';
import {checkNotShowAgain} from '../asyncStorage';

export const navigateByUserInfo = async (
  data: IBaseLineData | any,
  navigation: NavigationProp<any>,
) => {
  const hasBaseLine = Object.keys(data).length === 0 ? false : true;
  const canSkipOnboarding = await checkNotShowAgain('ONBOARDING');

  if (!canSkipOnboarding) {
    // canSkipOnboarding 아니면 가이드로
    navigation.navigate('Guide');
    return;
  }
  if (!hasBaseLine) {
    // canSkipOnboarding 있는데 baseline 없으면 FirstInput으로
    navigation.navigate('InputNav', {screen: 'FirstInput'});
    return;
  }

  // baseline 있으면 홈으로
  navigation.reset({
    index: 0,
    routes: [{name: 'BottomTabNav', params: {screen: 'Home'}}],
  });
};

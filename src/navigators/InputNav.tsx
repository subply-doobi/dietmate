import styled from 'styled-components/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {icons} from '../assets/icons/iconSource';

import FirstInput from '../screens/userInputScreen/FirstInput';
import SecondInput from '../screens/userInputScreen/SecondInput';
import ThirdInput from '../screens/userInputScreen/ThirdInput';

const Stack = createNativeStackNavigator();
const InputNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
      }}>
      {/* <Stack.Screen
        name="FirstInput"
        component={FirstInput}
        options={{
          headerTitle: '',
          headerRight: () => <StepIcon source={icons.step1_36} />,
        }}
      /> */}
      <Stack.Screen
        name="SecondInput"
        component={SecondInput}
        options={{
          headerTitle: '',
          headerRight: () => <StepIcon source={icons.step2_36} />,
        }}
      />
      <Stack.Screen
        name="ThirdInput"
        component={ThirdInput}
        options={{
          headerTitle: '',
          headerRight: () => <StepIcon source={icons.step3_36} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default InputNav;

const StepIcon = styled.Image`
  width: 36px;
  height: 36px;
`;
